import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpException,
  Post,
  Query,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import type { Request, Response } from 'express';
import { Throttle, ThrottlerGuard } from '@nestjs/throttler';
import { TypedConfigService } from '@common/config/typed-config.service';
import { Public } from '@modules/auth/decorator/public.decorator';
import { StartAuthDto } from '@modules/auth/dto/start-auth.dto';
import { VerifyOtpDto } from '@modules/auth/dto/verify-otp.dto';
import { PasskeyAuthenticateVerifyDto } from '@modules/auth/dto/passkey-authenticate-verify.dto';
import { AuthService } from '@modules/auth/service/auth.service';
import { PasskeyService } from '@modules/auth/service/passkey.service';

@Public()
@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly config: TypedConfigService,
    private readonly passkeyService: PasskeyService,
  ) { }

  @Get('login')
  loginPage(
    @Req() req: Request,
    @Res() res: Response,
    @Query('error') error?: string,
    @Query('returnTo') returnTo?: string,
  ): void {
    if (req.session.userId) {
      res.redirect('/profile');
      return;
    }
    const t = res.locals.t as (key: string) => string;
    res.render('view/pages/auth/login', {
      layout: false,
      pageTitle: t('page_title_login'),
      seoRobots: 'noindex, nofollow',
      csrfToken: this.authService.ensureCsrfToken(req),
      error: error ?? null,
      returnTo: returnTo ?? '/profile',
      showDevHint: this.isDevHintVisible(),
    });
  }

  @Post('login')
  @UseGuards(ThrottlerGuard)
  @Throttle({ default: { limit: 6, ttl: 60_000 } })
  async startLogin(
    @Req() req: Request,
    @Res() res: Response,
    @Body() body: StartAuthDto,
    @Query('returnTo') returnTo?: string,

  ): Promise<void> {
    try {
      this.authService.validateCsrf(req, body._csrf);
      const locale: string = res.locals.locale ?? 'fa';
      await this.authService.startLogin(req, body.identifier, locale);
      const q =
        returnTo && returnTo.startsWith('/')
          ? `?returnTo=${encodeURIComponent(returnTo)}`
          : '';
      res.redirect(`${res.locals.lp}/auth/verify${q}`);
    } catch (err: unknown) {
      res.redirect(
        `${res.locals.lp}/auth/login?error=${encodeURIComponent(this.resolveErrorMessage(err))}&returnTo=${encodeURIComponent(returnTo ?? '/profile')}`,
      );
    }
  }

  @Get('verify')
  verifyPage(
    @Req() req: Request,
    @Res() res: Response,
    @Query('error') error?: string,
    @Query('returnTo') returnTo?: string,
  ): void {
    if (req.session.userId) {
      res.redirect(returnTo?.startsWith('/') ? returnTo : '/profile');
      return;
    }
    if (!req.session.otpChallengeId) {
      res.redirect(`${res.locals.lp}/auth/login`);
      return;
    }
    const t = res.locals.t as (key: string) => string;
    res.render('view/pages/auth/verify', {
      layout: false,
      pageTitle: t('page_title_verify'),
      seoRobots: 'noindex, nofollow',
      csrfToken: this.authService.ensureCsrfToken(req),
      masked: req.session.pendingMasked ?? '',
      pendingKind: req.session.pendingKind ?? 'phone',
      error: error ?? null,
      returnTo: returnTo ?? '/profile',
      showDevHint: this.isDevHintVisible(),
    });
  }

  @Post('verify')
  @UseGuards(ThrottlerGuard)
  @Throttle({ default: { limit: 6, ttl: 60_000 } })
  async verifyOtp(
    @Req() req: Request,
    @Res() res: Response,
    @Body() body: VerifyOtpDto,
    @Query('returnTo') returnTo?: string,
  ): Promise<void> {
    try {
      this.authService.validateCsrf(req, body._csrf);
      await this.authService.verifyOtp(req, body.code);
      const lp: string = res.locals.lp ?? '';
      const rawTarget =
        returnTo && returnTo.startsWith('/') && !returnTo.startsWith('//')
          ? returnTo
          : '/profile';
      const target = lp && !rawTarget.startsWith(`${lp}/`) ? `${lp}${rawTarget}` : rawTarget;
      res.redirect(target);
    } catch (err: unknown) {
      res.redirect(
        `${res.locals.lp}/auth/verify?error=${encodeURIComponent(this.resolveErrorMessage(err))}&returnTo=${encodeURIComponent(returnTo ?? '/profile')}`,
      );
    }
  }

  @Post('passkey/authenticate/options')
  @HttpCode(200)
  @UseGuards(ThrottlerGuard)
  @Throttle({ default: { limit: 10, ttl: 60_000 } })
  async passkeyAuthOptions(@Req() req: Request) {
    return this.passkeyService.generateAuthenticationOptions(req);
  }

  @Post('passkey/authenticate/verify')
  @HttpCode(200)
  @UseGuards(ThrottlerGuard)
  @Throttle({ default: { limit: 10, ttl: 60_000 } })
  async passkeyAuthVerify(
    @Req() req: Request,
    @Res() res: Response,
    @Body() body: PasskeyAuthenticateVerifyDto,
    @Query('returnTo') returnTo?: string,
  ): Promise<void> {
    try {
      await this.passkeyService.verifyAuthentication(req, body.response);
      const target =
        returnTo && returnTo.startsWith('/') && !returnTo.startsWith('//')
          ? returnTo
          : '/profile';
      res.json({ ok: true, redirectTo: target });
    } catch (err: unknown) {
      res
        .status(401)
        .json({ ok: false, message: this.resolveErrorMessage(err) });
    }
  }

  @Post('logout')
  logout(
    @Req() req: Request,
    @Res() res: Response,
    @Body() body: { _csrf?: string },
  ): void {
    this.authService.validateCsrf(req, body._csrf);
    req.session.destroy(() => {
      res.redirect(res.locals.lp || '/');
    });
  }

  private isDevHintVisible(): boolean {
    const env = this.config.app.nodeEnv;
    return env !== 'production';
  }

  private resolveErrorMessage(err: unknown): string {
    if (err instanceof HttpException) {
      const response = err.getResponse();
      if (typeof response === 'string') {
        return response;
      }
      if (
        typeof response === 'object' &&
        response !== null &&
        'message' in response
      ) {
        const msg = (response as { message?: string | string[] }).message;
        if (Array.isArray(msg)) {
          return msg.join(' ');
        }
        if (typeof msg === 'string') {
          return msg;
        }
      }
    }
    if (err instanceof Error) {
      return err.message;
    }
    return 'خطایی رخ داد';
  }
}
