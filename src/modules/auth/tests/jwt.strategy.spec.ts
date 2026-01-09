import { JwtStrategy } from '../jwt.strategy';
import { UnauthorizedException } from '@nestjs/common';
import { mockTokenRepository } from '../__mocks__/token-repository.mock';
import { IJwtPayload } from '../interfaces/jwt-payload.interface';
import { UserRoleEnum } from '../../../database/entities/enums/user-role.enum';
import { Test } from '@nestjs/testing';
import { usersModuleProviders } from '../../users/__mocks__/users-module.mock';

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
  describe('when token is validate', () => {
    it('should return user if token is valid', async () => {
      const mockUser = { id: 1, username: 'test' };
      mockTokenRepository.findOne.mockResolvedValue({
        user: mockUser,
        isBlocked: false,
      });

      const result = await strategy.validate(payload);

      expect(result).toEqual(mockUser);
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
