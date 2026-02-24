import { JwtService } from '@nestjs/jwt';
import { MockServiceType } from '../../../types/mock-service.type';

export const mockJwtService: MockServiceType<JwtService> = {
  sign: jest.fn(),
  signAsync: jest.fn(),
  verify: jest.fn(),
  verifyAsync: jest.fn(),
  decode: jest.fn(),
};
