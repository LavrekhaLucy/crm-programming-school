import { MockServiceType } from '../../../../test/types/mock-service.type';
import { JwtService } from '@nestjs/jwt';

export const mockJwtService: MockServiceType<JwtService> = {
  sign: jest.fn(),
  signAsync: jest.fn(),
  verify: jest.fn(),
  verifyAsync: jest.fn(),
  decode: jest.fn(),
};
