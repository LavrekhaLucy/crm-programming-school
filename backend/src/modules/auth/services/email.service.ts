import * as path from 'path';
import * as nodemailer from 'nodemailer';
import { Transporter } from 'nodemailer';
import hbs from 'nodemailer-express-handlebars';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { EmailTypeToPayload } from '../../../types/email-type-to-payload.type';
import { emailConstants } from '../../../constants/email.constant';

@Injectable()
export class EmailService {
  private transporter: Transporter;

  constructor(private readonly configService: ConfigService) {
    const smtpEmail = this.configService.get<string>('email.smtpEmail');
    const smtpPassword = this.configService.get<string>('email.smtpPassword');

    this.transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: smtpEmail,
        pass: smtpPassword,
      },
    });

    const hbsOptions: hbs.NodemailerExpressHandlebarsOptions = {
      viewEngine: {
        extname: '.hbs',
        defaultLayout: 'main',
        layoutsDir: path.join(process.cwd(), 'src', 'templates', 'layouts'),
        partialsDir: path.join(process.cwd(), 'src', 'templates', 'partials'),
      },
      viewPath: path.join(process.cwd(), 'src', 'templates', 'views'),
      extName: '.hbs',
    };

    this.transporter.use('compile', hbs(hbsOptions));
  }

  public async sendMail<T extends keyof EmailTypeToPayload>(
    type: T,
    to: string,
    context: EmailTypeToPayload[T],
  ): Promise<void> {
    const info = (
      emailConstants as Record<
        keyof EmailTypeToPayload,
        { subject: string; template: string }
      >
    )[type];
    const { subject, template } = info;

    const smtpEmail = this.configService.get<string>('email.smtpEmail');

    const mailOptions = {
      from: `"No Reply" <${smtpEmail}>`,
      to,
      subject,
      template,
      context: {
        ...context,
        frontUrl: this.configService.get<string>('app.frontUrl'),
      },
    };

    await this.transporter.sendMail(mailOptions);
  }
}
