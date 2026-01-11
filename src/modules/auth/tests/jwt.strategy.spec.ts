import { JwtStrategy } from '../jwt.strategy';
import { UnauthorizedException } from '@nestjs/common';
import { mockTokenRepository } from '../__mocks__/token-repository.mock';
import { IJwtPayload } from '../interfaces/jwt-payload.interface';
import { UserRoleEnum } from '../../../database/entities/enums/user-role.enum';
import { Test } from '@nestjs/testing';
import { usersModuleProviders } from '../../users/__mocks__/users-module.mock';
import { mockUserEntity } from '../../users/__mocks__/user-entity.mock';
import { mockToken } from '../__mocks__/token.mock';

describe('JwtStrategy', () => {
  let strategy: JwtStrategy;

  const payload: IJwtPayload = {
    userId: 1,
    username: 'test',
    role: UserRoleEnum.MANAGER,
    jti: '123',
  };

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [...usersModuleProviders, JwtStrategy],
    }).compile();

    strategy = module.get(JwtStrategy);

    jest.clearAllMocks();
  });
  // it('should use JWT_ACCESS_SECRET from config', () => {
  //   mockConfigService.get.mockReturnValue('mySecret');
  //
  //   strategy = new JwtStrategy(mockConfigService, mockTokenRepository);
  //
  //   expect(mockConfigService.get).toHaveBeenCalledWith('JWT_ACCESS_SECRET');
  //   expect(strategy).toBeInstanceOf(JwtStrategy);
  // });
  //
  // it('should fallback to empty string if JWT_ACCESS_SECRET is not set', () => {
  //   mockConfigService.get.mockReturnValue(undefined);
  //
  //   strategy = new JwtStrategy(
  //     mockConfigService as unknown as ConfigService,
  //     mockTokenRepository as unknown as TokenRepository,
  //   );
  //
  //   expect(mockConfigService.get).toHaveBeenCalledWith('JWT_ACCESS_SECRET');
  //   expect(strategy).toBeInstanceOf(JwtStrategy);
  // });

  describe('when token is validate', () => {
    it('should return user if token is valid', async () => {
      mockTokenRepository.findOne.mockResolvedValue(mockToken);

      const result = await strategy.validate(payload);

      expect(result).toEqual(mockUserEntity);
      expect(mockTokenRepository.findOne).toHaveBeenCalledWith({
        where: { jti: '123', isBlocked: false },
        relations: ['user'],
      });
    });

    it('should throw UnauthorizedException if token is invalid', async () => {
      mockTokenRepository.findOne.mockResolvedValue(null);

      await expect(strategy.validate(payload)).rejects.toThrow(
        UnauthorizedException,
      );
    });
  });
});
