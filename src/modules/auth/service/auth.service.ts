import { randomUUID } from 'node:crypto';
import {
  BadRequestException,
  Injectable,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';
import type { Request } from 'express';
import { TypedConfigService } from '@common/config/typed-config.service';
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
import { SmsService } from '@modules/notification/sms.service';
import { MailService } from '@modules/notification/mail.service';

export interface StartAuthResult {
  masked: string;
  kind: 'phone' | 'email';
}

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    private readonly config: TypedConfigService,
    private readonly userRepository: UserRepository,
    private readonly otpChallengeRepository: OtpChallengeRepository,
    private readonly smsService: SmsService,
    private readonly mailService: MailService,
  ) {}

  ensureCsrfToken(req: Request): string {
    if (!req.session.csrfToken) {
      req.session.csrfToken = randomUUID();
    }
    return req.session.csrfToken;
  }

  validateCsrf(req: Request, token?: string): void {
    const expected = req.session.csrfToken;
    if (!expected || !token || token !== expected) {
      throw new BadRequestException('Invalid CSRF token');
    }
  }

  async startLogin(
    req: Request,
    rawIdentifier: string,
    locale = 'fa',
  ): Promise<StartAuthResult> {
    const parsed = parseIdentifier(rawIdentifier);
    if (!parsed) {
      throw new BadRequestException('شماره موبایل یا ایمیل معتبر وارد کنید.');
    }

    const auth = this.config.auth;
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

    this.logger.log(`OTP challenge #${saved.id} for ${parsed.masked} — code: ${auth.otpCode}`);

    if (parsed.kind === 'phone') {
      void this.smsService.sendOtp(parsed.normalized, auth.otpCode, locale);
    } else {
      void this.mailService.sendOtp(parsed.normalized, auth.otpCode, locale);
    }

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

    const auth = this.config.auth;
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

  async requestPhoneChange(
    req: Request,
    userId: number,
    rawPhone: string,
  ): Promise<{ masked: string }> {
    const parsed = parseIdentifier(rawPhone);
    if (!parsed || parsed.kind !== 'phone') {
      throw new BadRequestException('شماره موبایل معتبر وارد کنید.');
    }

    const currentUser = await this.userRepository.findOneById(userId);
    if (currentUser?.phone === parsed.normalized) {
      throw new BadRequestException('این شماره موبایل در حال حاضر ثبت شده است.');
    }

    const existing = await this.userRepository.findByIdentifier(parsed);
    if (existing && existing.id !== userId) {
      throw new BadRequestException('این شماره موبایل قبلاً توسط حساب دیگری ثبت شده است.');
    }

    const auth = this.config.auth;
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

    req.session.phoneChangeOtpChallengeId = saved.id;
    req.session.pendingNewPhone = parsed.normalized;

    this.logger.log(
      `Phone change OTP #${saved.id} for user #${userId} → ${parsed.masked} — dev code: ${auth.otpCode}`,
    );

    return { masked: parsed.masked };
  }

  async verifyPhoneChange(
    req: Request,
    userId: number,
    code: string,
  ): Promise<void> {
    const challengeId = req.session.phoneChangeOtpChallengeId;
    const pendingPhone = req.session.pendingNewPhone;

    if (!challengeId || !pendingPhone) {
      throw new BadRequestException('ابتدا شماره موبایل جدید را وارد کنید.');
    }

    const challenge =
      await this.otpChallengeRepository.findActiveById(challengeId);
    if (!challenge || challenge.consumedAt) {
      throw new BadRequestException('کد منقضی شده. دوباره تلاش کنید.');
    }

    if (challenge.expiresAt.getTime() < Date.now()) {
      throw new BadRequestException('کد منقضی شده. دوباره تلاش کنید.');
    }

    const auth = this.config.auth;
    if (challenge.attempts >= auth.otpMaxAttempts) {
      throw new UnauthorizedException(
        'تعداد تلاش بیش از حد. دوباره از ابتدا وارد شوید.',
      );
    }

    await this.otpChallengeRepository.updateOneById(challenge.id, {
      attempts: challenge.attempts + 1,
    });

    if (code.trim() !== auth.otpCode) {
      throw new UnauthorizedException('کد تایید اشتباه است.');
    }

    await this.otpChallengeRepository.updateOneById(challenge.id, {
      consumedAt: new Date(),
    });
    await this.userRepository.updateOneById(userId, { phone: pendingPhone });

    delete req.session.phoneChangeOtpChallengeId;
    delete req.session.pendingNewPhone;
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

  toViewUser(user: SessionUserPayload, locale = 'fa'): ViewCurrentUser {
    const maskedContact =
      user.phone != null
        ? `${user.phone.slice(0, 4)}*****${user.phone.slice(-2)}`
        : (user.email?.replace(/(^.).+(@.+$)/, '$1***$2') ?? '');

    const name = (user.displayName?.[locale] ?? user.displayName?.['fa'] ?? Object.values(user.displayName ?? {})[0])?.trim();
    const fallback = locale === 'en' ? 'User' : locale === 'ps' ? 'کاروونکی' : 'کاربر';
    const displayLabel =
      name ||
      (user.phone != null ? fallback : (user.email?.split('@')[0] ?? fallback));

    return {
      id: user.id,
      role: user.role,
      displayLabel,
      maskedContact,
    };
  }

  async updateProfile(
    userId: number,
    data: { displayName?: string; birthday?: string; bio?: string },
  ): Promise<void> {
    const patch: Partial<UserEntity> = {};
    if (data.displayName !== undefined)
      patch.displayName = data.displayName.trim() ? { fa: data.displayName.trim() } : null;
    if (data.birthday !== undefined)
      patch.birthday = /^\d{4}\/\d{2}\/\d{2}$/.test(data.birthday)
        ? data.birthday
        : null;
    if (data.bio !== undefined)
      patch.bio = data.bio.trim() || null;
    await this.userRepository.updateOneById(userId, patch);
  }

  private toSessionUser(user: UserEntity): SessionUserPayload {
    return {
      id: user.id,
      role: user.role,
      displayName: user.displayName,
      phone: user.phone,
      email: user.email,
      birthday: user.birthday,
      bio: user.bio,
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
