import {
  Body,
  Controller,
  Get,
  HttpException,
  Post,
  Query,
  Req,
  Res,
} from '@nestjs/common';
import type { Request, Response } from 'express';
import { TypedConfigService } from '@common/config/typed-config.service';
import { Public } from '@modules/auth/decorator/public.decorator';
import { StartAuthDto } from '@modules/auth/dto/start-auth.dto';
import { VerifyOtpDto } from '@modules/auth/dto/verify-otp.dto';
import { AuthService } from '@modules/auth/service/auth.service';

@Public()
@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly config: TypedConfigService,
  ) {}

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
    res.render('view/pages/auth/login', {
      layout: false,
      pageTitle: 'ورود یا ثبت نام — لیان امیری',
      seoRobots: 'noindex, nofollow',
      csrfToken: this.authService.ensureCsrfToken(req),
      error: error ?? null,
      returnTo: returnTo ?? '/profile',
      showDevHint: this.isDevHintVisible(),
    });
  }

  @Post('login')
  async startLogin(
    @Req() req: Request,
    @Res() res: Response,
    @Body() body: StartAuthDto,
    @Query('returnTo') returnTo?: string,
  ): Promise<void> {
    try {
      this.authService.validateCsrf(req, body._csrf);
      await this.authService.startLogin(req, body.identifier);
      const q =
        returnTo && returnTo.startsWith('/')
          ? `?returnTo=${encodeURIComponent(returnTo)}`
          : '';
      res.redirect(`/auth/verify${q}`);
    } catch (err: unknown) {
      res.redirect(
        `/auth/login?error=${encodeURIComponent(this.resolveErrorMessage(err))}&returnTo=${encodeURIComponent(returnTo ?? '/profile')}`,
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
      res.redirect('/auth/login');
      return;
    }
    res.render('view/pages/auth/verify', {
      layout: false,
      pageTitle: 'تایید حساب — لیان امیری',
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
  async verifyOtp(
    @Req() req: Request,
    @Res() res: Response,
    @Body() body: VerifyOtpDto,
    @Query('returnTo') returnTo?: string,
  ): Promise<void> {
    try {
      this.authService.validateCsrf(req, body._csrf);
      await this.authService.verifyOtp(req, body.code);
      const target =
        returnTo && returnTo.startsWith('/') && !returnTo.startsWith('//')
          ? returnTo
          : '/profile';
      res.redirect(target);
    } catch (err: unknown) {
      res.redirect(
        `/auth/verify?error=${encodeURIComponent(this.resolveErrorMessage(err))}&returnTo=${encodeURIComponent(returnTo ?? '/profile')}`,
      );
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
      res.redirect('/');
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
