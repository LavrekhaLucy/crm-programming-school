import { Test, TestingModule } from '@nestjs/testing';
import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';
import { EmailService } from '../services/email.service';
import { EmailTypeEnum } from '../../../database/entities/enums/email-type.enum';
import { emailConstants } from '../../../constants/email.constant';

import { SendMailOptions } from 'nodemailer';

jest.mock('nodemailer-express-handlebars', () => {
  return jest.fn(() => {
    return (
      _mail: { data: SendMailOptions },
      callback: (err?: Error | null) => void,
    ) => {
      callback();
    };
  });
});
jest.mock('nodemailer');

describe('EmailService', () => {
  let service: EmailService;

  const mockTransporter = {
    use: jest.fn(),
    sendMail: jest.fn().mockResolvedValue({ messageId: '123' }),
  };

  beforeEach(async () => {
    (nodemailer.createTransport as jest.Mock).mockReturnValue(mockTransporter);

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        EmailService,
        {
          provide: ConfigService,
          useValue: {
            get: jest.fn((key: string) => {
              if (key === 'email.smtpEmail') return 'test@gmail.com';
              if (key === 'email.smtpPassword') return 'password';
              if (key === 'app.frontUrl') return 'http://localhost:4200';
              return null;
            }),
          },
        },
      ],
    }).compile();

    service = module.get<EmailService>(EmailService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('sendMail', () => {
    it('should pull correct subject and template for WELCOME type', async () => {
      const to = 'ivan@example.com';
      const context = { name: 'Ivan' };
      const expectedInfo = emailConstants[EmailTypeEnum.WELCOME];

      await service.sendMail(EmailTypeEnum.WELCOME, to, context);

      expect(mockTransporter.sendMail).toHaveBeenCalledWith({
        from: '"No Reply" <test@gmail.com>',
        to: to,
        subject: expectedInfo.subject,
        template: expectedInfo.template,
        context: {
          name: 'Ivan',
          frontUrl: 'http://localhost:4200',
        },
      });
    });

    it('should send ACTIVATE_ACCOUNT email with link in context', async () => {
      const to = 'manager@test.com';
      const context = {
        name: 'Manager',
        link: 'http://localhost:4200/auth/activate/token',
      };
      const expectedInfo = emailConstants[EmailTypeEnum.ACTIVATE_ACCOUNT];

      await service.sendMail(EmailTypeEnum.ACTIVATE_ACCOUNT, to, context);

      expect(mockTransporter.sendMail).toHaveBeenCalledWith({
        from: '"No Reply" <test@gmail.com>',
        to: to,
        subject: expectedInfo.subject,
        template: expectedInfo.template,
        context: {
          name: 'Manager',
          link: 'http://localhost:4200/auth/activate/token',
          frontUrl: 'http://localhost:4200',
        },
      });
    });

    it('should initialize transporter with correct config', () => {
      expect(nodemailer.createTransport).toHaveBeenCalledWith({
        service: 'gmail',
        auth: {
          user: 'test@gmail.com',
          pass: 'password',
        },
      });
      expect(mockTransporter.use).toHaveBeenCalledWith(
        'compile',
        expect.any(Function),
      );
    });
    it('should throw an error if transport.sendMail fails', async () => {
      const error = new Error('SMTP Error');
      mockTransporter.sendMail.mockRejectedValue(error);

      await expect(
        service.sendMail(EmailTypeEnum.WELCOME, 'test@test.com', {
          name: 'Ivan',
        }),
      ).rejects.toThrow('SMTP Error');
    });
  });
});
