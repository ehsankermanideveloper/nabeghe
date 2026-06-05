import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import type { Request } from 'express';
import { CurrentUser } from '@modules/auth/decorator/current-user.decorator';
import { SessionAuthGuard } from '@modules/auth/guard/session-auth.guard';
import type { SessionUserPayload } from '@modules/auth/interfaces/auth-session.interface';
import { PasskeyRegisterVerifyDto } from '@modules/auth/dto/passkey-register-verify.dto';
import { PasskeyService } from '@modules/auth/service/passkey.service';

@Controller('api/passkey')
@UseGuards(SessionAuthGuard)
export class PasskeyApiController {
  constructor(private readonly passkeyService: PasskeyService) {}

  @Get('register/options')
  registrationOptions(
    @Req() req: Request,
    @CurrentUser() user: SessionUserPayload,
  ) {
    return this.passkeyService.generateRegistrationOptions(req, user);
  }

  @Post('register/verify')
  @HttpCode(200)
  async registrationVerify(
    @Req() req: Request,
    @CurrentUser() user: SessionUserPayload,
    @Body() body: PasskeyRegisterVerifyDto,
  ) {
    const passkey = await this.passkeyService.verifyRegistration(
      req,
      user.id,
      body.response,
      body.name,
    );
    return { ok: true, passkey };
  }

  @Get('list')
  list(@CurrentUser() user: SessionUserPayload) {
    return this.passkeyService.listPasskeys(user.id);
  }

  @Delete(':id')
  @HttpCode(200)
  async remove(
    @CurrentUser() user: SessionUserPayload,
    @Param('id') id: string,
  ) {
    await this.passkeyService.deletePasskey(user.id, parseInt(id, 10));
    return { ok: true };
  }
}
