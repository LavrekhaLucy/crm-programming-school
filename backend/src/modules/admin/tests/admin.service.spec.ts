import { Test } from '@nestjs/testing';
import { AdminService } from '../services/admin.service';
import { mockUserService } from '../../users/__mocks__/user-service.mock';
import { mockOrdersService } from '../../orders/__mocks__/orders-service.mock';
import { mockCreateManagerReqDto } from '../__mocks__/create-manager-dto.mock';
import { mockUserResDto } from '../../users/__mocks__/user-res-dto.mock';
import { mockUserEntity } from '../../users/__mocks__/user-entity.mock';
import { usersModuleProviders } from '../../users/__mocks__/users-module.mock';
import { mockOrdersStatsDto } from '../../orders/__mocks__/orders-stats-dto.mock';
import { UserEntity } from '../../../database/entities/user.entity';
import { mockJwtService } from '../../auth/__mocks__/jwt-service.mock';
import { NotFoundException } from '@nestjs/common';

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
  describe('createActivationToken', () => {
    const managerId = 1;

    it('should successfully create an activation link', async () => {
      const mockManager = Object.assign(new UserEntity(), {
        id: managerId,
        email: 'manager@example.com',
      });

      jest
        .spyOn(mockUserService, 'findById')
        .mockResolvedValueOnce(mockManager);
      mockJwtService.sign.mockReturnValue('mocked_jwt_token');

      const result = await service.createActivationToken(managerId);

      expect(result).toEqual({
        link: 'http://localhost:3000/auth/activate/mocked_jwt_token',
      });

      expect(mockJwtService.sign).toHaveBeenCalledWith(
        expect.objectContaining({
          sub: managerId,
          email: 'manager@example.com',
          action: 'activate',
        }),
        { expiresIn: '30m' },
      );
    });

    it('should throw NotFoundException when manager is not found', async () => {
      jest.spyOn(mockUserService, 'findById').mockResolvedValueOnce(null);

      const attempt = service.createActivationToken(999);

      await expect(attempt).rejects.toThrow(NotFoundException);
      await expect(attempt).rejects.toThrow(`Manager with ID 999 not found`);
      expect(mockJwtService.sign as jest.Mock).not.toHaveBeenCalled();
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
