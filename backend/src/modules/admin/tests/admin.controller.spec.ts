import { AdminController } from '../admin.controller';
import { Test } from '@nestjs/testing';
import { StatusesEnum } from '../../../database/entities/enums/statuses.enum';
import { mockAdminService } from '../__mocks__/admin-service.mock';
import { mockCreateManagerResDto } from '../__mocks__/create-manager-res.dto.mock';
import { mockUserResDto } from '../../users/__mocks__/user-res-dto.mock';
import { usersModuleProviders } from '../../users/__mocks__/users-module.mock';
import { mockCreateManagerReqDto } from '../__mocks__/create-manager-dto.mock';
import { NotFoundException } from '@nestjs/common';

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
    it('should return all users', async () => {
      jest
        .spyOn(mockAdminService, 'getAllUsers')
        .mockResolvedValue([mockUserResDto]);

      const result = await adminController.getAllUsers();

      expect(mockAdminService.getAllUsers).toHaveBeenCalledTimes(1);
      expect(result).toEqual([mockUserResDto]);
    });
  });

  describe('re-token', () => {
    it('should return a token when calling reToken', async () => {
      const userId = 1;
      const expectedResult = { token: 'mock.jwt.token' };

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

  describe('banUser', () => {
    it('should ban a user', async () => {
      const userId = 1;

      jest
        .spyOn(mockAdminService, 'disableUser')
        .mockResolvedValue(mockUserResDto);

      const result = await adminController.ban(userId);

      expect(mockAdminService.disableUser).toHaveBeenCalledTimes(1);
      expect(mockAdminService.disableUser).toHaveBeenCalledWith(userId);
      expect(result).toEqual(mockUserResDto);
    });
  });

  describe('unbanUser', () => {
    it('should unban a user', async () => {
      const userId = 1;
      jest
        .spyOn(mockAdminService, 'enableUser')
        .mockResolvedValue(mockUserResDto);

      const result = await adminController.unban(userId);

      expect(mockAdminService.enableUser).toHaveBeenCalledTimes(1);
      expect(mockAdminService.enableUser).toHaveBeenCalledWith(userId);
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
