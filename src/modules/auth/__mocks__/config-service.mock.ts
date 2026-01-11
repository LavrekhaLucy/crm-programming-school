import { ConfigService } from '@nestjs/config';

export const mockConfigService = {
  get: jest.fn((key: string) => {
    if (key === 'JWT_ACCESS_SECRET') return 'mySecret';
  }),
} as unknown as ConfigService;
