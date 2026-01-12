import { AuthController } from '../auth.controller';
import { Test } from '@nestjs/testing';
import { mockLoginDto } from '../__mocks__/login-dto.mock';
import { mockToken } from '../__mocks__/token.mock';
import { mockAuthService } from '../__mocks__/auth-service.mock';
import { mockRegisterReqDto } from '../../users/__mocks__/user-register-dto.mock';
import { usersModuleProviders } from '../../users/__mocks__/users-module.mock';

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

  describe('register', () => {
    it('should register a user', async () => {
      jest
        .spyOn(mockAuthService, 'register')
        .mockResolvedValue(mockRegisterReqDto);
      const result = await authController.register(mockRegisterReqDto);
      expect(mockAuthService.register).toHaveBeenCalledWith(mockRegisterReqDto);
      expect(result).toEqual(mockRegisterReqDto);
    });
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
  describe('logOut', () => {
    it('should logOut user', async () => {
      jest.spyOn(mockAuthService, 'logOut').mockResolvedValue(undefined);
      const result = await authController.logOut(mockRefreshReqDto);
      expect(mockAuthService.logOut).toHaveBeenCalledWith(mockRefreshReqDto);
      expect(result).toBeUndefined();
    });
  });
});
