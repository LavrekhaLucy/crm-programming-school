import { AuthService } from '../services/auth.service';
import { Test } from '@nestjs/testing';
import { userQB } from '../../users/__mocks__/user-repository.mock';
import { mockTokenRepository } from '../__mocks__/token-repository.mock';
import { JwtService } from '@nestjs/jwt';
import { mockLoginDto } from '../__mocks__/login-dto.mock';
import { MockServiceType } from '../../../../test/types/mock-service.type';
import { UserEntity } from '../../../database/entities/user.entity';
import { UnauthorizedException } from '@nestjs/common';
import { mockUser, validatePasswordMock } from '../__mocks__/user.mock';
import { usersModuleProviders } from '../../users/__mocks__/users-module.mock';
import { mockToken } from '../__mocks__/token.mock';

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
  // describe('register', () => {
  //   it('should register a new user and return UserResDto', async () => {
  //     mockUserRepository.create.mockReturnValue(mockUserEntity);
  //     mockUserRepository.save.mockResolvedValue(mockUserEntity);
  //
  //     const result = await service.register(mockBaseUserReqDto);
  //
  //     expect(mockUserRepository.create).toHaveBeenCalledWith(
  //       mockBaseUserReqDto,
  //     );
  //     expect(mockUserRepository.save).toHaveBeenCalledWith(mockUserEntity);
  //     expect(result).toEqual({
  //       id: mockUserEntity.id,
  //       email: mockUserEntity.email,
  //       role: mockUserEntity.role,
  //       name: mockUserEntity.name,
  //       avatarUrl: mockUserEntity.avatarUrl,
  //       locale: mockUserEntity.locale,
  //       isAdultAccepted: mockUserEntity.isAdultAccepted,
  //     });
  //   });
  // });

  describe('login', () => {
    beforeEach(() => {
      jest.clearAllMocks();
    });

    it('should login successfully', async () => {
      userQB.getOne.mockResolvedValueOnce(mockUser as UserEntity);
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

  describe('getMe', () => {
    it('should return user data without sensitive information', async () => {
      const result = await service.getMe(mockUser);

      expect(result).not.toHaveProperty('password');
      expect(result.id).toEqual(mockUser.id);
      expect(result.email).toEqual(mockUser.email);
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
