import { AuthService } from '../services/auth.service';
import { Test } from '@nestjs/testing';
import {
  mockUserRepository,
  userQB,
} from '../../users/__mocks__/user-repository.mock';
import { mockTokenRepository } from '../__mocks__/token-repository.mock';
import { JwtService } from '@nestjs/jwt';
import { mockLoginDto } from '../__mocks__/login-dto.mock';
import { MockServiceType } from '../../../../test/types/mock-service.type';
import { UserEntity } from '../../../database/entities/user.entity';
import {
  BadRequestException,
  ForbiddenException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { mockUser, validatePasswordMock } from '../__mocks__/user.mock';
import { usersModuleProviders } from '../../users/__mocks__/users-module.mock';
import { mockToken } from '../__mocks__/token.mock';
import * as bcrypt from 'bcrypt';
import { mockJwtService } from '../__mocks__/jwt-service.mock';

jest.mock('bcrypt');

describe('AuthService', () => {
  let service: AuthService;
  let jwtService: MockServiceType<JwtService>;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [...usersModuleProviders, AuthService],
    }).compile();

    service = module.get(AuthService);
    jwtService = module.get(JwtService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('login', () => {
    beforeEach(() => {
      jest.clearAllMocks();
    });

    it('should login successfully', async () => {
      const activeUser = { ...mockUser, isActive: true };
      userQB.getOne.mockResolvedValueOnce(activeUser as UserEntity);
      validatePasswordMock.mockResolvedValueOnce(true);

      jwtService.sign.mockReturnValue('signedToken');

      const result = await service.login(mockLoginDto);

      expect(validatePasswordMock).toHaveBeenCalledWith(mockLoginDto.password);

      expect(result).toEqual({
        accessToken: 'signedToken',
        refreshToken: 'signedToken',
      });
    });
    it('should throw UnauthorizedException if user not found', async () => {
      userQB.getOne.mockResolvedValueOnce(null);

      await expect(service.login(mockLoginDto)).rejects.toThrow(
        UnauthorizedException,
      );
    });
    it('should throw UnauthorizedException if password is not valid', async () => {
      userQB.getOne.mockResolvedValueOnce(mockUser as UserEntity);
      validatePasswordMock.mockResolvedValueOnce(false);

      await expect(service.login(mockLoginDto)).rejects.toThrow(
        UnauthorizedException,
      );
      expect(validatePasswordMock).toHaveBeenCalledWith(mockLoginDto.password);
    });
    it('should throw ForbiddenException if the user is inactive', async () => {
      const bannedUser = Object.assign(new UserEntity(), mockUser, {
        isActive: false,
      });

      userQB.getOne.mockResolvedValueOnce(bannedUser);
      validatePasswordMock.mockResolvedValueOnce(true);

      const loginAttempt = service.login(mockLoginDto);

      await expect(loginAttempt).rejects.toThrow(ForbiddenException);
      await expect(loginAttempt).rejects.toThrow(
        'User is banned. Please contact the administrator.',
      );
    });
  });

  describe('refresh', () => {
    it('should verify refresh token and return new tokens', async () => {
      jwtService.verify.mockReturnValue({ userId: 1 });
      jwtService.sign.mockReturnValue('newSignedToken');

      const refreshDto = { refreshToken: 'validRefreshToken' };
      const result = await service.refresh(refreshDto);

      expect(jwtService.verify).toHaveBeenCalledWith('validRefreshToken');
      expect(jwtService.sign).toHaveBeenCalledTimes(2);
      expect(result).toEqual({
        accessToken: 'newSignedToken',
        refreshToken: 'newSignedToken',
      });
    });
    it('should throw UnauthorizedException for invalid refresh token', async () => {
      jwtService.verify.mockImplementation(() => {
        throw new Error('Invalid token');
      });

      await expect(
        service.refresh({ refreshToken: 'invalidRefreshToken' }),
      ).rejects.toThrow(UnauthorizedException);

      expect(jwtService.verify).toHaveBeenCalledWith('invalidRefreshToken');
      expect(jwtService.sign).not.toHaveBeenCalled();
    });

    it('should throw UnauthorizedException for invalid or expired refresh token', async () => {
      jwtService.verify.mockReturnValue({ userId: 1 });
      mockTokenRepository.findOne.mockResolvedValueOnce(null);

      await expect(
        service.refresh({ refreshToken: 'someRefreshToken' }),
      ).rejects.toThrow(UnauthorizedException);

      expect(jwtService.verify).toHaveBeenCalledWith('someRefreshToken');
      expect(mockTokenRepository.findOne).toHaveBeenCalledWith({
        where: { refreshToken: 'someRefreshToken', isBlocked: false },
        relations: ['user'],
      });
      expect(jwtService.sign).not.toHaveBeenCalled();
    });
  });

  describe('activate', () => {
    it('should activate user successfully', async () => {
      const dto = { token: 'valid-token', password: '12345678' };

      mockJwtService.verify.mockReturnValue({
        sub: 1,
        action: 'activate',
      });

      mockUserRepository.findOne.mockResolvedValue({
        id: 1,
        isActive: false,
      } as UserEntity);

      jest.spyOn(bcrypt, 'hash').mockResolvedValue('hashedPassword' as never);

      const result = await service.activate(dto);

      expect(result).toEqual({ message: 'Account activated successfully' });
      expect(mockUserRepository.update).toHaveBeenCalledWith(1, {
        password: 'hashedPassword',
        isActive: true,
      });
    });

    it('should throw if token invalid', async () => {
      mockJwtService.verify.mockImplementation(() => {
        throw new Error();
      });

      await expect(
        service.activate({ token: 'bad', password: '123' }),
      ).rejects.toThrow(BadRequestException);
    });

    it('should throw if token type invalid', async () => {
      mockJwtService.verify.mockReturnValue({
        sub: 1,
        action: 'wrong',
      });

      await expect(
        service.activate({ token: 'token', password: '123' }),
      ).rejects.toThrow(BadRequestException);
    });

    it('should throw if user not found', async () => {
      mockJwtService.verify.mockReturnValue({
        sub: 1,
        action: 'activate',
      });

      mockUserRepository.findOne.mockResolvedValue(null);

      await expect(
        service.activate({ token: 'token', password: '123' }),
      ).rejects.toThrow(NotFoundException);
    });

    it('should throw if user already active', async () => {
      mockJwtService.verify.mockReturnValue({
        sub: 1,
        action: 'activate',
      });

      mockUserRepository.findOne.mockResolvedValue({
        id: 1,
        isActive: true,
      } as UserEntity);

      await expect(
        service.activate({ token: 'token', password: '123' }),
      ).rejects.toThrow(BadRequestException);
    });
  });

  describe('getMe', () => {
    it('should return user data without sensitive information', async () => {
      const loadCountSpy = jest.spyOn(userQB, 'loadRelationCountAndMap');

      const mockUserFromDb = Object.assign(new UserEntity(), mockUser, {
        isActive: true,
      });
      userQB.getOne.mockResolvedValueOnce(mockUserFromDb);

      const result = await service.getMe(mockUser as UserEntity);
      expect(loadCountSpy).toHaveBeenCalledWith(
        'user.total_orders',
        'user.orders',
      );
      expect(result.id).toEqual(mockUser.id);
    });

    it('should throw NotFoundException if user does not exist in db', async () => {
      userQB.getOne.mockResolvedValueOnce(null);

      try {
        await service.getMe({ id: 999 } as UserEntity);
        fail('Should have thrown an error'); // Якщо помилка не виникла — тест провалено
      } catch (error) {
        expect(error).toBeInstanceOf(NotFoundException);
      }

      expect(userQB.where.mock.calls).toContainEqual([
        'user.id = :id',
        { id: 999 },
      ]);
    });
  });

  describe('logout', () => {
    it('should block the refresh token if it exists', async () => {
      mockTokenRepository.findOne.mockResolvedValue(mockToken);

      await service.logOut({ refreshToken: 'validRefreshToken' });

      expect(mockTokenRepository.findOne).toHaveBeenCalledWith({
        where: { refreshToken: 'validRefreshToken', isBlocked: false },
      });

      expect(mockTokenRepository.save).toHaveBeenCalledWith({
        ...mockToken,
        isBlocked: true,
      });
    });

    it('should do nothing if refresh token does not exist', async () => {
      mockTokenRepository.findOne.mockResolvedValue(null);

      await expect(
        service.logOut({ refreshToken: 'nonExistingToken' }),
      ).resolves.not.toThrow();

      expect(mockTokenRepository.save).not.toHaveBeenCalled();
    });
  });
});
