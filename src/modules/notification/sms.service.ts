import { Injectable, Logger } from '@nestjs/common';
import { TypedConfigService } from '@common/config/typed-config.service';

const OTP_TEXT: Record<string, string> = {
  fa: 'کد تایید آکادمی لیان امیری: {code}',
  en: 'Liyan Amiri Academy verification code: {code}',
  ps: 'د لیان امیري اکاډمۍ تایید کوډ: {code}',
};

@Injectable()
export class SmsService {
  private readonly logger = new Logger(SmsService.name);

  constructor(private readonly config: TypedConfigService) {}

  async sendOtp(toNumber: string, code: string, locale: string): Promise<void> {
    const text = (OTP_TEXT[locale] ?? OTP_TEXT['fa']).replace('{code}', code);
    const { smsApiUrl, smsApiKey } = this.config.notification;

    const headers: Record<string, string> = { 'Content-Type': 'application/json' };
    if (smsApiKey) headers['Authorization'] = `Bearer ${smsApiKey}`;

    try {
      const res = await fetch(smsApiUrl, {
        method: 'POST',
        headers,
        body: JSON.stringify({ content: text, toNumber }),
      });

      if (!res.ok) {
        const body = await res.text().catch(() => '');
        this.logger.error(`SMS failed [${res.status}]: ${body}`);
      } else {
        this.logger.log(`SMS sent to ${toNumber.slice(0, 6)}***`);
      }
    } catch (err) {
      this.logger.error('SMS request error', err);
    }
  }
}
