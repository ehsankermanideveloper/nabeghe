import { Injectable, Logger } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import type { Transporter } from 'nodemailer';
import { TypedConfigService } from '@common/config/typed-config.service';
import { buildOtpEmail } from './templates/otp.email';

@Injectable()
export class MailService {
  private readonly logger = new Logger(MailService.name);
  private transporter: Transporter | null = null;

  constructor(private readonly config: TypedConfigService) {}

  private getTransporter(): Transporter {
    if (this.transporter) return this.transporter;
    const { smtpHost, smtpPort, smtpSecure, smtpUser, smtpPass } = this.config.notification;
    this.transporter = nodemailer.createTransport({
      host: smtpHost,
      port: smtpPort,
      secure: smtpSecure,
      auth: smtpUser ? { user: smtpUser, pass: smtpPass } : undefined,
    });
    return this.transporter;
  }

  async sendOtp(toEmail: string, code: string, locale: string): Promise<void> {
    const { mailFrom, mailFromName } = this.config.notification;
    const appUrl = this.config.app.appUrl;
    const siteName = mailFromName;
    const expiryMinutes = this.config.auth.otpTtlMinutes;

    const { subject, html } = buildOtpEmail({ code, locale, siteName, siteUrl: appUrl, expiryMinutes });

    try {
      await this.getTransporter().sendMail({
        from: `"${mailFromName}" <${mailFrom}>`,
        to: toEmail,
        subject,
        html,
      });
      this.logger.log(`Email sent to ${toEmail.replace(/(^.).+(@.+$)/, '$1***$2')}`);
    } catch (err) {
      this.logger.error('Email send error', err);
    }
  }
}
