import { Global, Module } from '@nestjs/common';
import { SmsService } from './sms.service';
import { MailService } from './mail.service';

@Global()
@Module({
  providers: [SmsService, MailService],
  exports: [SmsService, MailService],
})
export class NotificationModule {}
