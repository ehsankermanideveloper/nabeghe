import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import type { Request } from 'express';
import {
  generateAuthenticationOptions,
  generateRegistrationOptions,
  verifyAuthenticationResponse,
  verifyRegistrationResponse,
} from '@simplewebauthn/server';
import type {
  AuthenticationResponseJSON,
  AuthenticatorTransportFuture,
  PublicKeyCredentialCreationOptionsJSON,
  PublicKeyCredentialRequestOptionsJSON,
  RegistrationResponseJSON,
} from '@simplewebauthn/server';
import { TypedConfigService } from '@common/config/typed-config.service';
import { PasskeyEntity } from '@modules/auth/entity/passkey.entity';
import { PasskeyRepository } from '@modules/auth/repository/passkey.repository';
import { UserRepository } from '@modules/auth/repository/user.repository';
import type { UserEntity } from '@modules/auth/entity/user.entity';
import type { SessionUserPayload } from '@modules/auth/interfaces/auth-session.interface';

export interface PasskeySummary {
  id: number;
  name: string | null;
  deviceType: string;
  backedUp: boolean;
  createdAt: Date;
}

@Injectable()
export class PasskeyService {
  constructor(
    private readonly config: TypedConfigService,
    private readonly passkeyRepository: PasskeyRepository,
    private readonly userRepository: UserRepository,
  ) {}

  private get rpId(): string {
    return new URL(this.config.app.appUrl).hostname;
  }

  private get origin(): string {
    return this.config.app.appUrl;
  }

  async generateRegistrationOptions(
    req: Request,
    user: SessionUserPayload,
  ): Promise<PublicKeyCredentialCreationOptionsJSON> {
    const existing = await this.passkeyRepository.findByUserId(user.id);
    const excludeCredentials = existing.map((pk) => ({
      id: pk.credentialId,
      transports: pk.transports
        ? (JSON.parse(pk.transports) as AuthenticatorTransportFuture[])
        : undefined,
    }));

    const userName = user.phone ?? user.email ?? `user-${user.id}`;
    const userDisplayName = user.displayName ?? userName;

    const options = await generateRegistrationOptions({
      rpName: 'آکادمی نابغه',
      rpID: this.rpId,
      userName,
      userDisplayName,
      attestationType: 'none',
      excludeCredentials,
      authenticatorSelection: {
        residentKey: 'preferred',
        userVerification: 'preferred',
      },
    });

    req.session.passkeyRegChallenge = options.challenge;
    return options;
  }

  async verifyRegistration(
    req: Request,
    userId: number,
    response: RegistrationResponseJSON,
    name?: string,
  ): Promise<PasskeySummary> {
    const expectedChallenge = req.session.passkeyRegChallenge;
    if (!expectedChallenge) {
      throw new BadRequestException('چالش ثبت اثرانگشت منقضی شده. دوباره تلاش کنید.');
    }

    let verification: Awaited<ReturnType<typeof verifyRegistrationResponse>>;
    try {
      verification = await verifyRegistrationResponse({
        response,
        expectedChallenge,
        expectedOrigin: this.origin,
        expectedRPID: this.rpId,
        requireUserVerification: false,
      });
    } catch {
      throw new BadRequestException('ثبت اثرانگشت ناموفق بود.');
    }

    if (!verification.verified || !verification.registrationInfo) {
      throw new BadRequestException('ثبت اثرانگشت ناموفق بود.');
    }

    delete req.session.passkeyRegChallenge;

    const { credential, credentialDeviceType, credentialBackedUp } =
      verification.registrationInfo;

    const existing = await this.passkeyRepository.findByCredentialId(credential.id);
    if (existing) {
      throw new BadRequestException('این اثرانگشت قبلاً ثبت شده است.');
    }

    const passkey = this.passkeyRepository.build({
      userId,
      credentialId: credential.id,
      publicKey: Buffer.from(credential.publicKey),
      counter: credential.counter,
      deviceType: credentialDeviceType,
      backedUp: credentialBackedUp,
      transports: credential.transports ? JSON.stringify(credential.transports) : null,
      name: name?.trim() || null,
    });

    const saved = (await this.passkeyRepository.save(passkey)) as PasskeyEntity;
    return {
      id: saved.id,
      name: saved.name,
      deviceType: saved.deviceType,
      backedUp: saved.backedUp,
      createdAt: saved.createdAt,
    };
  }

  async generateAuthenticationOptions(
    req: Request,
  ): Promise<PublicKeyCredentialRequestOptionsJSON> {
    const options = await generateAuthenticationOptions({
      rpID: this.rpId,
      userVerification: 'preferred',
    });

    req.session.passkeyAuthChallenge = options.challenge;
    return options;
  }

  async verifyAuthentication(
    req: Request,
    response: AuthenticationResponseJSON,
  ): Promise<UserEntity> {
    const expectedChallenge = req.session.passkeyAuthChallenge;
    if (!expectedChallenge) {
      throw new BadRequestException('چالش احراز هویت منقضی شده. دوباره تلاش کنید.');
    }

    const passkey = await this.passkeyRepository.findByCredentialId(response.id);
    if (!passkey) {
      throw new UnauthorizedException('اثرانگشت شناخته نشد.');
    }

    const transports = passkey.transports
      ? (JSON.parse(passkey.transports) as AuthenticatorTransportFuture[])
      : undefined;

    let verification: Awaited<ReturnType<typeof verifyAuthenticationResponse>>;
    try {
      verification = await verifyAuthenticationResponse({
        response,
        expectedChallenge,
        expectedOrigin: this.origin,
        expectedRPID: this.rpId,
        credential: {
          id: passkey.credentialId,
          publicKey: new Uint8Array(passkey.publicKey),
          counter: passkey.counter,
          transports,
        },
        requireUserVerification: false,
      });
    } catch {
      throw new UnauthorizedException('احراز هویت با اثرانگشت ناموفق بود.');
    }

    if (!verification.verified) {
      throw new UnauthorizedException('احراز هویت با اثرانگشت ناموفق بود.');
    }

    delete req.session.passkeyAuthChallenge;

    await this.passkeyRepository.updateOneById(passkey.id, {
      counter: verification.authenticationInfo.newCounter,
    });

    const user = await this.userRepository.findOneById(passkey.userId);
    if (!user) throw new UnauthorizedException('کاربر یافت نشد.');

    await this.userRepository.updateOneById(user.id, { lastLoginAt: new Date() });
    req.session.userId = user.id;

    return user;
  }

  async listPasskeys(userId: number): Promise<PasskeySummary[]> {
    const passkeys = await this.passkeyRepository.findByUserId(userId);
    return passkeys.map((pk) => ({
      id: pk.id,
      name: pk.name,
      deviceType: pk.deviceType,
      backedUp: pk.backedUp,
      createdAt: pk.createdAt,
    }));
  }

  async deletePasskey(userId: number, passkeyId: number): Promise<void> {
    const passkey = await this.passkeyRepository.findOne({
      where: { id: passkeyId, userId },
    });
    if (!passkey) throw new BadRequestException('اثرانگشت یافت نشد.');
    await this.passkeyRepository.softDeleteById(passkeyId);
  }
}
