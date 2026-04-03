import { AuthController } from '../auth.controller';
import { Test } from '@nestjs/testing';
import { mockLoginDto } from '../__mocks__/login-dto.mock';
import { mockToken } from '../__mocks__/token.mock';
import { mockAuthService } from '../__mocks__/auth-service.mock';
import { usersModuleProviders } from '../../users/__mocks__/users-module.mock';
import { mockUser } from '../__mocks__/user.mock';
import { UserRequest } from '../interfaces/user-request.interface';
import { mockRequest } from '../__mocks__/request.mock';
import { mockExpectedResult } from '../__mocks__/expect-result.mock';
import { activateDtoMock } from '../__mocks__/activate-dto.mock';
import { BadRequestException } from '@nestjs/common';

describe(AuthController.name, () => {
  let authController: AuthController;

  const mockRefreshReqDto = {
    refreshToken: 'refresh-token',
  };
  beforeEach(async () => {
    const module = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [...usersModuleProviders],
    }).compile();

    authController = module.get(AuthController);
  });
  afterEach(() => {
    jest.clearAllMocks();
  });
  it('should be defined', () => {
    expect(authController).toBeDefined();
  });
  describe('login', () => {
    it('should login user', async () => {
      jest.spyOn(mockAuthService, 'login').mockResolvedValue(mockToken);
      const result = await authController.login(mockLoginDto);
      expect(mockAuthService.login).toHaveBeenCalledWith(mockLoginDto);
      expect(result).toEqual(mockToken);
    });
  });
  describe('refresh', () => {
    it('should refresh tokens', async () => {
      jest
        .spyOn(mockAuthService, 'refresh')
        .mockResolvedValue(mockRefreshReqDto);
      const result = await authController.refresh(mockRefreshReqDto);
      expect(mockAuthService.refresh).toHaveBeenCalledWith(mockRefreshReqDto);
      expect(result).toEqual(mockRefreshReqDto);
    });
  });

  describe('activate', () => {
    it('should call authService.activate with correct parameters', async () => {
      const expectedResult = { message: 'Account activated successfully' };
      mockAuthService.activate.mockResolvedValue(expectedResult);

      const result = await authController.activate(activateDtoMock);

      expect(mockAuthService.activate).toHaveBeenCalledWith(activateDtoMock);

      expect(result).toEqual(expectedResult);
    });
    it('should throw BadRequestException if token is invalid', async () => {
      mockAuthService.activate.mockRejectedValue(
        new BadRequestException('Invalid token'),
      );

      await expect(authController.activate(activateDtoMock)).rejects.toThrow(
        BadRequestException,
      );
    });
  });
  describe('recovery', () => {
    it('should call authService.recovery with correct parameters', async () => {
      const expectedResult = { message: 'Password updated successfully' };
      mockAuthService.recovery.mockResolvedValue(expectedResult);

      const result = await authController.recovery(activateDtoMock);

      expect(mockAuthService.recovery).toHaveBeenCalledWith(activateDtoMock);

      expect(result).toEqual(expectedResult);
    });
    it('should throw BadRequestException if token is invalid', async () => {
      mockAuthService.recovery.mockRejectedValue(
        new BadRequestException('Invalid token'),
      );

      await expect(authController.recovery(activateDtoMock)).rejects.toThrow(
        BadRequestException,
      );
    });
  });
  describe('getMe', () => {
    it('should return result from authService.getMe', async () => {
      jest
        .spyOn(mockAuthService, 'getMe')
        .mockResolvedValue(mockExpectedResult);

      const result = await authController.getMe(mockRequest as UserRequest);

      expect(mockAuthService.getMe).toHaveBeenCalledWith(mockUser);
      expect(result).toEqual(mockExpectedResult);
    });
  });

  describe('logOut', () => {
    it('should logOut user', async () => {
      jest.spyOn(mockAuthService, 'logOut').mockResolvedValue(undefined);
      const result = await authController.logOut(mockRefreshReqDto);
      expect(mockAuthService.logOut).toHaveBeenCalledWith(mockRefreshReqDto);
      expect(result).toBeUndefined();
    });
  });
});
