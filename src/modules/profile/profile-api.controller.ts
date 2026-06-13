import { BadRequestException, Body, Controller, HttpCode, Post, Req, UseGuards } from '@nestjs/common';
import type { Request } from 'express';
import { CurrentUser } from '@modules/auth/decorator/current-user.decorator';
import { SessionAuthGuard } from '@modules/auth/guard/session-auth.guard';
import type { SessionUserPayload } from '@modules/auth/interfaces/auth-session.interface';
import { AuthService } from '@modules/auth/service/auth.service';

@Controller('api/profile')
@UseGuards(SessionAuthGuard)
export class ProfileApiController {
  constructor(private readonly authService: AuthService) {}

  @Post('info')
  @HttpCode(200)
  async updateInfo(
    @Req() req: Request,
    @CurrentUser() user: SessionUserPayload,
    @Body() body: { displayName?: string; birthday?: string; bio?: string },
  ) {
    const t = (req.res as any).locals.t as (key: string) => string;
    await this.authService.updateProfile(user.id, body);
    return { message: t('msg_update_success') };
  }

  @Post('phone/request')
  async requestPhoneChange(
    @Req() req: Request,
    @CurrentUser() user: SessionUserPayload,
    @Body() body: { phone?: string },
  ) {
    const t = (req.res as any).locals.t as (key: string) => string;
    if (!body.phone?.trim()) {
      throw new BadRequestException(t('msg_error_generic'));
    }
    const { masked } = await this.authService.requestPhoneChange(
      req,
      user.id,
      body.phone,
    );
    return { masked };
  }

  @Post('phone/verify')
  async verifyPhoneChange(
    @Req() req: Request,
    @CurrentUser() user: SessionUserPayload,
    @Body() body: { code?: string },
  ) {
    const t = (req.res as any).locals.t as (key: string) => string;
    if (!body.code?.trim()) {
      throw new BadRequestException(t('msg_error_generic'));
    }
    const phone = req.session.pendingNewPhone ?? '';
    await this.authService.verifyPhoneChange(req, user.id, body.code);
    return { phone, message: t('msg_phone_changed') };
  }
}
