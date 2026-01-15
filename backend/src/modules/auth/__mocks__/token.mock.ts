import { mockUserEntity } from '../../users/__mocks__/user-entity.mock';
import { TokenEntity } from '../../../database/entities/token.entity';

export const mockToken: TokenEntity = {
  id: 1,
  accessToken: 'accessToken',
  refreshToken: 'refreshToken',
  accessTokenExpiresAt: new Date(Date.now() + 10000),
  refreshTokenExpiresAt: new Date(Date.now() + 20000),
  isBlocked: false,
  user: mockUserEntity,
  createdAt: new Date(),
  updatedAt: new Date(),
} as unknown as TokenEntity;
