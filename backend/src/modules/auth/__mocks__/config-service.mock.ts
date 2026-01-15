import { ConfigService } from '@nestjs/config';

export const mockConfigService: Pick<ConfigService, 'get'> & {
  get: jest.Mock;
} = {
  get: jest.fn(),
};
