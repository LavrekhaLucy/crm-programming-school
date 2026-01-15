import { JwtStrategy } from '../jwt.strategy';
import { UnauthorizedException } from '@nestjs/common';
import { mockTokenRepository } from '../__mocks__/token-repository.mock';
import { IJwtPayload } from '../interfaces/jwt-payload.interface';
import { UserRoleEnum } from '../../../database/entities/enums/user-role.enum';
import { Test } from '@nestjs/testing';
import { usersModuleProviders } from '../../users/__mocks__/users-module.mock';
import { mockUserEntity } from '../../users/__mocks__/user-entity.mock';
import { mockToken } from '../__mocks__/token.mock';
import { mockConfigService } from '../__mocks__/config-service.mock';
import { ConfigService } from '@nestjs/config';
import { TokenRepository } from '../../repository/services/token.repository';

describe('JwtStrategy', () => {
  let strategy: JwtStrategy;

  const payload: IJwtPayload = {
    userId: 1,
    username: 'test',
    role: UserRoleEnum.MANAGER,
    jti: '123',
  };

  beforeEach(async () => {
    mockConfigService.get.mockReturnValue('super-secret-key');

    const module = await Test.createTestingModule({
      providers: [...usersModuleProviders, JwtStrategy],
    }).compile();

    strategy = module.get(JwtStrategy);

    jest.clearAllMocks();
  });

  it('should be defined and initialized with correct secret', () => {
    const tempStrategy = new JwtStrategy(
      mockConfigService as unknown as ConfigService,
      mockTokenRepository as unknown as TokenRepository,
    );
    expect(mockConfigService.get).toHaveBeenCalledWith('JWT_ACCESS_SECRET');

    expect(tempStrategy).toBeDefined();
  });

  it('should throw an error if JWT_ACCESS_SECRET is missing', () => {
    mockConfigService.get.mockReturnValue(undefined);

    expect(() => {
      new JwtStrategy(
        mockConfigService as unknown as ConfigService,
        mockTokenRepository as unknown as TokenRepository,
      );
    }).toThrow('JWT_ACCESS_SECRET is not defined');
  });

  describe('when token is validate', () => {
    beforeEach(() => {
      jest.clearAllMocks();
    });
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
