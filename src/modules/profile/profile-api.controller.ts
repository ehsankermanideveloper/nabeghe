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
    @CurrentUser() user: SessionUserPayload,
    @Body() body: { displayName?: string; birthday?: string; bio?: string },
  ) {
    await this.authService.updateProfile(user.id, body);
    return { message: 'اطلاعات با موفقیت بروزرسانی شد.' };
  }

  @Post('phone/request')
  async requestPhoneChange(
    @Req() req: Request,
    @CurrentUser() user: SessionUserPayload,
    @Body() body: { phone?: string },
  ) {
    if (!body.phone?.trim()) {
      throw new BadRequestException('شماره موبایل را وارد کنید.');
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
    if (!body.code?.trim()) {
      throw new BadRequestException('کد تایید را وارد کنید.');
    }
    const phone = req.session.pendingNewPhone ?? '';
    await this.authService.verifyPhoneChange(req, user.id, body.code);
    return { phone, message: 'شماره موبایل با موفقیت تغییر یافت.' };
  }
}
