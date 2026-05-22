import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get('health')
  health(): { ok: boolean } {
    return { ok: true };
  }

  @Get()
  home(): Record<string, string> {
    return this.appService.getWelcomePayload();
  }
}
