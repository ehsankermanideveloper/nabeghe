import { randomBytes } from 'node:crypto';
import { Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import type { Request, Response } from 'express';
import { OAuth2Client } from 'google-auth-library';
import { TypedConfigService } from '@common/config/typed-config.service';
import { UserRepository } from '@modules/auth/repository/user.repository';
import type { UserEntity } from '@modules/auth/entity/user.entity';

const OAUTH_STATE_COOKIE = '_oauthst';
const OAUTH_RETURN_COOKIE = '_oauthrt';
const COOKIE_OPTS = {
  httpOnly: true,
  sameSite: 'lax' as const,
  maxAge: 10 * 60 * 1000, // 10 minutes
  path: '/',
  signed: true,
};

@Injectable()
export class GoogleAuthService {
  private readonly logger = new Logger(GoogleAuthService.name);
  private client: OAuth2Client | null = null;

  constructor(
    private readonly config: TypedConfigService,
    private readonly userRepository: UserRepository,
  ) {}

  isEnabled(): boolean {
    const { googleClientId, googleClientSecret } = this.config.auth;
    return !!(googleClientId && googleClientSecret);
  }

  private getClient(): OAuth2Client {
    if (this.client) return this.client;
    const { googleClientId, googleClientSecret } = this.config.auth;
    const appUrl = this.config.app.appUrl;
    this.client = new OAuth2Client({
      clientId: googleClientId!,
      clientSecret: googleClientSecret!,
      redirectUri: `${appUrl}/auth/google/callback`,
    });
    return this.client;
  }

  buildAuthUrl(_req: Request, res: Response, returnTo = '/profile'): string {
    const state = randomBytes(16).toString('hex');

    // Store state in signed cookies — more reliable than session alone
    // because the cookie is set directly in the redirect response headers
    res.cookie(OAUTH_STATE_COOKIE, state, COOKIE_OPTS);
    res.cookie(OAUTH_RETURN_COOKIE, returnTo, COOKIE_OPTS);

    return this.getClient().generateAuthUrl({
      access_type: 'online',
      scope: ['openid', 'email', 'profile'],
      state,
      prompt: 'select_account',
    });
  }

  async handleCallback(req: Request, res: Response, code: string, state: string): Promise<{ user: UserEntity; returnTo: string }> {
    const savedState = (req as any).signedCookies?.[OAUTH_STATE_COOKIE] as string | undefined;

    if (!savedState || savedState !== state) {
      this.logger.warn(`OAuth state mismatch — cookie: ${savedState ?? 'missing'}, param: ${state}`);
      throw new UnauthorizedException('Invalid OAuth state');
    }

    const returnTo = ((req as any).signedCookies?.[OAUTH_RETURN_COOKIE] as string | undefined) ?? '/profile';

    // Clear the OAuth cookies immediately
    res.clearCookie(OAUTH_STATE_COOKIE, { path: '/' });
    res.clearCookie(OAUTH_RETURN_COOKIE, { path: '/' });

    const client = this.getClient();
    const { tokens } = await client.getToken(code);
    client.setCredentials(tokens);

    if (!tokens.id_token) {
      throw new UnauthorizedException('No ID token received from Google');
    }

    const ticket = await client.verifyIdToken({
      idToken: tokens.id_token,
      audience: this.config.auth.googleClientId!,
    });

    const payload = ticket.getPayload();
    if (!payload?.sub || !payload.email) {
      throw new UnauthorizedException('Invalid Google profile');
    }

    const { user, isNew } = await this.userRepository.findOrCreateByGoogle({
      googleId: payload.sub,
      email: payload.email,
      displayName: payload.name ?? null,
    });

    await this.userRepository.updateOneById(user.id, { lastLoginAt: new Date() });

    req.session.userId = user.id;
    req.session.flash = { type: 'success', messageKey: isNew ? 'flash_register_success' : 'flash_login_success' };

    this.logger.log(`Google login: user #${user.id} (${payload.email})`);

    return { user, returnTo };
  }
}
