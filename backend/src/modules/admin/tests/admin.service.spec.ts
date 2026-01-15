import { Test } from '@nestjs/testing';
import { AdminService } from '../services/admin.service';
import { mockUserService } from '../../users/__mocks__/user-service.mock';
import { mockOrdersService } from '../../orders/__mocks__/orders-service.mock';
import { mockCreateManagerReqDto } from '../__mocks__/create-manager-dto.mock';
import { mockUserResDto } from '../../users/__mocks__/user-res-dto.mock';
import { mockResponseOrderDto } from '../../orders/__mocks__/res-order-dto.mock';
import { mockUserEntity } from '../../users/__mocks__/user-entity.mock';
import { usersModuleProviders } from '../../users/__mocks__/users-module.mock';
import { mockOrdersStatsDto } from '../../orders/__mocks__/orders-stats-dto.mock';

describe('AdminService', () => {
  let service: AdminService;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [...usersModuleProviders, AdminService],
    }).compile();

    service = module.get(AdminService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });
  describe('createManager', () => {
    it('should delegate createManager to UserService.create', async () => {
      mockUserService.create.mockResolvedValue(mockUserEntity);

      const result = await service.createManager(mockCreateManagerReqDto);
      expect(mockUserService.create).toHaveBeenCalledWith(
        mockCreateManagerReqDto,
      );
      expect(result).toEqual(mockUserEntity);
    });
  });
  describe('getAllUsers', () => {
    it('should delegate getAllUsers to UserService.findAll', async () => {
      mockUserService.findAll.mockResolvedValue([mockUserResDto]);

      const result = await service.getAllUsers();
      expect(mockUserService.findAll).toHaveBeenCalledTimes(1);
      expect(result).toEqual([mockUserResDto]);
    });
  });
  describe('disableUser', () => {
    it('should delegate disableUser to UserService.disable', async () => {
      const userId = 1;
      mockUserService.disable.mockResolvedValue(mockUserResDto);

      const result = await service.disableUser(userId);
      expect(mockUserService.disable).toHaveBeenCalledWith(userId);
      expect(result).toEqual(mockUserResDto);
    });
  });
  describe('enableUser', () => {
    it('should delegate enableUser to UserService.enable', async () => {
      const userId = 1;
      mockUserService.enable.mockResolvedValue(mockUserResDto);

      const result = await service.enableUser(userId);
      expect(mockUserService.enable).toHaveBeenCalledWith(userId);
      expect(result).toEqual(mockUserResDto);
    });
  });
  describe('getAllOrders', () => {
    it('should delegate getAllOrders to OrdersService.findAll', async () => {
      mockOrdersService.findAll.mockResolvedValue([mockResponseOrderDto]);

      const result = await service.getAllOrders();
      expect(mockOrdersService.findAll).toHaveBeenCalledTimes(1);
      expect(result).toEqual([mockResponseOrderDto]);
    });
  });
  describe('getOrdersStats', () => {
    it('should delegate getOrdersStats to OrdersService.getStatsByStatus', async () => {
      mockOrdersService.getStatsByStatus.mockResolvedValue([
        mockOrdersStatsDto,
      ]);

      const result = await service.getOrdersStats();
      expect(mockOrdersService.getStatsByStatus).toHaveBeenCalledTimes(1);
      expect(result).toEqual([mockOrdersStatsDto]);
    });
  });
});
