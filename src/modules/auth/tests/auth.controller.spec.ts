import { AuthController } from '../auth.controller';
import { AuthService } from '../services/auth.service';
import { Test } from '@nestjs/testing';

describe(AuthController.name, () => {
  let authController: AuthController;

  let mockAuthService: {
    register: jest.Mock;
    login: jest.Mock;
    refresh: jest.Mock;
    logOut: jest.Mock;
  };

  beforeEach(async () => {
    mockAuthService = {
      register: jest.fn(),
      login: jest.fn(),
      refresh: jest.fn(),
      logOut: jest.fn(),
    };

    const module = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: AuthService,
          useValue: mockAuthService,
        },
      ],
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
      const mockRegisterReqDto = {
        username: 'username',
        email: 'email',
        password: 'password',
        name: 'name',
        surname: 'surname',
      };
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
      const mockLoginReqDto = {
        login: 'login',
        password: 'password',
      };
      const mockTokens = {
        accessToken: 'access-token',
        refreshToken: 'refresh-token',
      };

      jest.spyOn(mockAuthService, 'login').mockResolvedValue(mockTokens);

      const result = await authController.login(mockLoginReqDto);

      expect(mockAuthService.login).toHaveBeenCalledWith(mockLoginReqDto);
      expect(result).toEqual(mockTokens);
    });
  });
  describe('refresh', () => {
    it('should refresh tokens', async () => {
      const mockRefreshReqDto = {
        refreshToken: 'refresh-token',
      };
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
      const mockRefreshReqDto = {
        refreshToken: 'refresh-token',
      };
      jest.spyOn(mockAuthService, 'logOut').mockResolvedValue(undefined);

      const result = await authController.logOut(mockRefreshReqDto);

      expect(mockAuthService.logOut).toHaveBeenCalledWith(mockRefreshReqDto);
      expect(result).toBeUndefined();
    });
  });
});
