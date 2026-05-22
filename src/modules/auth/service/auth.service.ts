import { randomUUID } from 'node:crypto';
import {
  BadRequestException,
  Injectable,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import type { Request } from 'express';
import type { AuthConfig } from '../../../config/auth.config';
import { OtpChallengeEntity } from '@modules/auth/entity/otp-challenge.entity';
import { UserEntity } from '@modules/auth/entity/user.entity';
import { OtpChallengeRepository } from '@modules/auth/repository/otp-challenge.repository';
import { UserRepository } from '@modules/auth/repository/user.repository';
import type { SessionUserPayload } from '@modules/auth/interfaces/auth-session.interface';
import type { ViewCurrentUser } from '@modules/auth/interfaces/auth-session.interface';
import {
  parseIdentifier,
  type ParsedIdentifier,
} from '@modules/auth/util/identifier.util';

export interface StartAuthResult {
  masked: string;
  kind: 'phone' | 'email';
}

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    private readonly configService: ConfigService,
    private readonly userRepository: UserRepository,
    private readonly otpChallengeRepository: OtpChallengeRepository,
  ) {}

  private authConfig(): AuthConfig {
    return this.configService.getOrThrow<AuthConfig>('auth');
  }

  ensureCsrfToken(req: Request): string {
    if (!req.session.csrfToken) {
      req.session.csrfToken = randomUUID();
    }
    return req.session.csrfToken;
  }

  validateCsrf(req: Request, token?: string): void {
    console.log(req.session.csrfToken);
    
    const expected = req.session.csrfToken;
    if (!expected || !token || token !== expected) {
      throw new BadRequestException('Invalid CSRF token');
    }
  }

  async startLogin(
    req: Request,
    rawIdentifier: string,
  ): Promise<StartAuthResult> {
    const parsed = parseIdentifier(rawIdentifier);
    if (!parsed) {
      throw new BadRequestException('شماره موبایل یا ایمیل معتبر وارد کنید.');
    }

    const auth = this.authConfig();
    const expiresAt = new Date(Date.now() + auth.otpTtlMinutes * 60_000);

    const challenge = this.otpChallengeRepository.build({
      identifier: parsed.normalized,
      expiresAt,
      attempts: 0,
      consumedAt: null,
      ipAddress: req.ip ?? null,
    });
    const saved = (await this.otpChallengeRepository.save(
      challenge,
    )) as OtpChallengeEntity;

    req.session.otpChallengeId = saved.id;
    req.session.pendingMasked = parsed.masked;
    req.session.pendingKind = parsed.kind;

    this.logger.log(
      `OTP challenge #${saved.id} for ${parsed.masked} — dev code: ${auth.otpCode} (SMS disabled)`,
    );

    return { masked: parsed.masked, kind: parsed.kind };
  }

  async verifyOtp(req: Request, code: string): Promise<UserEntity> {
    const challengeId = req.session.otpChallengeId;
    if (!challengeId) {
      throw new BadRequestException('ابتدا شماره یا ایمیل را وارد کنید.');
    }

    const challenge =
      await this.otpChallengeRepository.findActiveById(challengeId);
    if (!challenge || challenge.consumedAt) {
      throw new BadRequestException('کد منقضی شده. دوباره تلاش کنید.');
    }

    if (challenge.expiresAt.getTime() < Date.now()) {
      throw new BadRequestException('کد منقضی شده. دوباره تلاش کنید.');
    }

    const auth = this.authConfig();
    if (challenge.attempts >= auth.otpMaxAttempts) {
      throw new UnauthorizedException(
        'تعداد تلاش بیش از حد. دوباره از ابتدا وارد شوید.',
      );
    }

    await this.otpChallengeRepository.updateOneById(challenge.id, {
      attempts: challenge.attempts + 1,
    });

    const normalizedCode = code.trim();
    if (normalizedCode !== auth.otpCode) {
      throw new UnauthorizedException('کد تایید اشتباه است.');
    }

    const parsed = this.parseFromChallenge(challenge.identifier);
    const user = await this.userRepository.findOrCreateByIdentifier(parsed);

    await this.otpChallengeRepository.updateOneById(challenge.id, {
      consumedAt: new Date(),
    });

    await this.userRepository.updateOneById(user.id, {
      lastLoginAt: new Date(),
    });

    req.session.userId = user.id;
    delete req.session.otpChallengeId;
    delete req.session.pendingMasked;
    delete req.session.pendingKind;

    return user;
  }

  logout(req: Request): void {
    req.session.destroy(() => undefined);
  }

  async getSessionUser(userId: number): Promise<SessionUserPayload | null> {
    const user = await this.userRepository.findOneById(userId);
    if (!user) {
      return null;
    }
    return this.toSessionUser(user);
  }

  toViewUser(user: SessionUserPayload): ViewCurrentUser {
    const maskedContact =
      user.phone != null
        ? `${user.phone.slice(0, 4)}*****${user.phone.slice(-2)}`
        : (user.email?.replace(/(^.).+(@.+$)/, '$1***$2') ?? '');

    const displayLabel =
      user.displayName?.trim() ||
      (user.phone != null ? 'کاربر' : (user.email?.split('@')[0] ?? 'کاربر'));

    return {
      id: user.id,
      role: user.role,
      displayLabel,
      maskedContact,
    };
  }

  private toSessionUser(user: UserEntity): SessionUserPayload {
    return {
      id: user.id,
      role: user.role,
      displayName: user.displayName,
      phone: user.phone,
      email: user.email,
    };
  }

  private parseFromChallenge(normalized: string): ParsedIdentifier {
    if (normalized.includes('@')) {
      return {
        kind: 'email',
        normalized,
        masked: normalized.replace(/(^.).+(@.+$)/, '$1***$2'),
      };
    }
    return {
      kind: 'phone',
      normalized,
      masked: `${normalized.slice(0, 4)}*****${normalized.slice(-2)}`,
    };
  }
}
