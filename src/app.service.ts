import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getWelcomePayload(): Record<string, string> {
    return {
      message: 'Nabeghe Core',
      demoPage: '/demo',
    };
  }
}
