import { Controller, Get, Render, Req, UseGuards } from '@nestjs/common';
import type { Request } from 'express';
import { CurrentUser } from '@modules/auth/decorator/current-user.decorator';
import { SessionAuthGuard } from '@modules/auth/guard/session-auth.guard';
import type { SessionUserPayload } from '@modules/auth/interfaces/auth-session.interface';
import { AuthService } from '@modules/auth/service/auth.service';

@Controller('profile')
@UseGuards(SessionAuthGuard)
export class ProfileController {
  constructor(private readonly authService: AuthService) {}

  @Get()
  @Render('view/pages/profile/index')
  index(
    @Req() req: Request,
    @CurrentUser() user: SessionUserPayload,
  ): Record<string, unknown> {
    return {
      pageTitle: 'پنل کاربری — نابغه',
      user,
      csrfToken: this.authService.ensureCsrfToken(req),
    };
  }
}
