import { MockServiceType } from '../../../types/mock-service.type';
import { EmailService } from '../services/email.service';

export const mockEmailService: MockServiceType<EmailService> = {
  sendMail: jest.fn().mockResolvedValue(undefined),
};
