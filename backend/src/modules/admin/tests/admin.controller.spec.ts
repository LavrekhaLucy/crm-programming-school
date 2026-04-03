import { AdminController, RequestWithUser } from '../admin.controller';
import { Test } from '@nestjs/testing';
import { StatusesEnum } from '../../../database/entities/enums/statuses.enum';
import { mockAdminService } from '../__mocks__/admin-service.mock';
import { mockCreateManagerResDto } from '../__mocks__/create-manager-res.dto.mock';
import { mockUserResDto } from '../../users/__mocks__/user-res-dto.mock';
import { usersModuleProviders } from '../../users/__mocks__/users-module.mock';
import { mockCreateManagerReqDto } from '../__mocks__/create-manager-dto.mock';
import { NotFoundException } from '@nestjs/common';
import { mockStats } from '../__mocks__/stats.mock';

describe(AdminController.name, () => {
  let adminController: AdminController;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      controllers: [AdminController],
      providers: [...usersModuleProviders],
    }).compile();

    adminController = module.get<AdminController>(AdminController);
  });
  afterEach(() => {
    jest.clearAllMocks();
  });
  it('should be defined', () => {
    expect(adminController).toBeDefined();
  });

  describe('createManager', () => {
    it('should create a manager', async () => {
      jest
        .spyOn(mockAdminService, 'createManager')
        .mockResolvedValue(mockCreateManagerResDto);

      const result = await adminController.createManager(
        mockCreateManagerReqDto,
      );

      expect(mockAdminService.createManager).toHaveBeenCalledWith(
        mockCreateManagerReqDto,
      );
      expect(result).toEqual(mockCreateManagerResDto);
    });
  });

  describe('getAllUsers', () => {
    it('should return users, total and stats with explicit params', async () => {
      const page = 2;
      const limit = 10;
      const mockTotal = 7;

      jest.spyOn(mockAdminService, 'getAllUsers').mockResolvedValue({
        users: [mockUserResDto],
        total: mockTotal,
        stats: mockStats,
      });

      const result = await adminController.getAllUsers(page, limit);

      expect(mockAdminService.getAllUsers).toHaveBeenCalledWith(page, limit);
      expect(result.total).toBe(7);
    });
    it('should use default pagination values when no params provided', async () => {
      mockAdminService.getAllUsers.mockResolvedValue({
        users: [mockUserResDto],
        total: 7,
        stats: mockStats,
      });

      await adminController.getAllUsers();

      expect(mockAdminService.getAllUsers).toHaveBeenCalledWith(1, 5);
    });
  });

  describe('re-token', () => {
    it('should return a token when calling reToken', async () => {
      const userId = 1;
      const expectedResult = {
        link: 'http://localhost:3000/auth/activation/mock.jwt.token',
      };
      jest
        .spyOn(mockAdminService, 'createActivationToken')
        .mockResolvedValue(expectedResult);

      const result = await adminController.reToken(userId);

      expect(result).toEqual(expectedResult);
      expect(mockAdminService.createActivationToken).toHaveBeenCalledWith(
        userId,
      );
    });

    it('should throw an error if service fails', async () => {
      const userId = 999;

      jest
        .spyOn(mockAdminService, 'createActivationToken')
        .mockRejectedValue(new NotFoundException('User not found'));

      await expect(adminController.reToken(userId)).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('recovery-token', () => {
    it('should return a link when calling recoveryToken', async () => {
      const userId = 1;
      const expectedResult = {
        link: 'http://localhost:3000/auth/recovery/mock.jwt.token',
      };

      jest
        .spyOn(mockAdminService, 'createRecoveryToken')
        .mockResolvedValue(expectedResult);

      const result = await adminController.recoveryToken(userId);

      expect(result).toEqual(expectedResult);
      expect(mockAdminService.createRecoveryToken).toHaveBeenCalledWith(userId);
    });

    it('should throw NotFoundException if service fails', async () => {
      const userId = 999;

      jest
        .spyOn(mockAdminService, 'createRecoveryToken')
        .mockRejectedValue(new NotFoundException('User not found'));

      await expect(adminController.recoveryToken(userId)).rejects.toThrow(
        NotFoundException,
      );
      await expect(adminController.recoveryToken(userId)).rejects.toThrow(
        'User not found',
      );
    });
  });

  describe('banUser', () => {
    it('should ban a user ', async () => {
      const userId = 1;
      const mockRequest = {
        user: mockUserResDto,
      };

      jest
        .spyOn(mockAdminService, 'disableUser')
        .mockResolvedValue(mockUserResDto);

      const result = await adminController.ban(
        userId,
        mockRequest as RequestWithUser,
      );

      expect(mockAdminService.disableUser).toHaveBeenCalledTimes(1);
      expect(mockAdminService.disableUser).toHaveBeenCalledWith(
        userId,
        mockRequest.user,
      );
      expect(result).toEqual(mockUserResDto);
    });
  });

  describe('unbanUser', () => {
    it('should unban a user', async () => {
      const userId = 1;
      const mockRequest = {
        user: mockUserResDto,
      };

      jest
        .spyOn(mockAdminService, 'enableUser')
        .mockResolvedValue(mockUserResDto);

      const result = await adminController.unban(
        userId,
        mockRequest as RequestWithUser,
      );

      expect(mockAdminService.enableUser).toHaveBeenCalledTimes(1);
      expect(mockAdminService.enableUser).toHaveBeenCalledWith(
        userId,
        mockRequest.user,
      );
      expect(result).toEqual(mockUserResDto);
    });
  });

  describe('getOrdersStats', () => {
    it('should call adminService.getOrdersStats', async () => {
      const mockOrdersStatsDto = {
        status: StatusesEnum.INWORK,
        count: 10,
      };
      jest
        .spyOn(mockAdminService, 'getOrdersStats')
        .mockResolvedValue([mockOrdersStatsDto]);
      await adminController.getOrdersStats();
      expect(mockAdminService.getOrdersStats).toHaveBeenCalledTimes(1);
    });
  });
});
