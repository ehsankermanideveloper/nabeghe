import { registerAs } from '@nestjs/config';

export interface NotificationConfig {
  smsApiUrl: string;
  smsApiKey: string | null;
  smtpHost: string;
  smtpPort: number;
  smtpSecure: boolean;
  smtpUser: string;
  smtpPass: string;
  mailFrom: string;
  mailFromName: string;
}

export const getNotificationConfig = (): NotificationConfig => {
  const env = process.env;
  return {
    smsApiUrl: env.SMS_API_URL ?? 'https://sms.qased.com/sms/send',
    smsApiKey: env.SMS_API_KEY ?? null,
    smtpHost: env.SMTP_HOST ?? 'smtp.gmail.com',
    smtpPort: Number(env.SMTP_PORT ?? 587),
    smtpSecure: env.SMTP_SECURE === 'true',
    smtpUser: env.SMTP_USER ?? '',
    smtpPass: env.SMTP_PASS ?? '',
    mailFrom: env.MAIL_FROM ?? env.SMTP_USER ?? 'noreply@liyanamiri.com',
    mailFromName: env.MAIL_FROM_NAME ?? 'آکادمی لیان امیری',
  };
};

export default registerAs('notification', getNotificationConfig);
