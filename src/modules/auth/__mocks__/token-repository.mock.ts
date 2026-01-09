import { TokenEntity } from '../../../database/entities/token.entity';
import { mockUserEntity } from '../../users/__mocks__/user-entity.mock';

export const mockTokenRepository = {
  create: jest.fn().mockImplementation((dto: Partial<TokenEntity>) => dto),
  save: jest.fn().mockResolvedValue({ id: 1 } as TokenEntity),
  findOne: jest.fn().mockResolvedValue({
    refreshToken: 'validRefreshToken',
    isBlocked: false,
    refreshTokenExpiresAt: new Date(Date.now() + 10000),
    user: mockUserEntity,
  }),
  blockRefreshToken: jest
    .fn()
    .mockResolvedValue({ refreshToken: 'validRefreshToken' }),
};
