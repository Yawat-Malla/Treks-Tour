import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import nodemailer from 'nodemailer';

@Injectable()
export class MailService {
  private transporter: nodemailer.Transporter | null = null;

  constructor(private readonly config: ConfigService) {
    const host = this.config.get<string>('SMTP_HOST');
    if (host) {
      this.transporter = nodemailer.createTransport({
        host,
        port: Number(this.config.get('SMTP_PORT') || 587),
        secure: false,
        auth: this.config.get('SMTP_USER')
          ? {
              user: this.config.get<string>('SMTP_USER'),
              pass: this.config.get<string>('SMTP_PASS'),
            }
          : undefined,
      });
    }
  }

  async send(to: string, subject: string, text: string, html?: string) {
    const from = this.config.get<string>('SMTP_FROM') || 'Annapurna Trails <hello@annapurnatrails.com>';
    if (!this.transporter) {
      console.log('[mail:dev]', { to, subject, text });
      return;
    }
    await this.transporter.sendMail({ from, to, subject, text, html: html || text });
  }
}
