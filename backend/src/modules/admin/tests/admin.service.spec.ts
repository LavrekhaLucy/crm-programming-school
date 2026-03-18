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
import { mockEmailService } from '../../auth/__mocks__/email-service.mock';
import { UserRoleEnum } from '../../../database/entities/enums/user-role.enum';

describe('AdminService', () => {
  let service: AdminService;

  const userId = 1;
  const currentUser = {
    id: 99,
    role: UserRoleEnum.ADMIN,
    email: 'admin@test.com',
  } as UserEntity;

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

      const expectedUrl = 'http://localhost:3000';
      process.env.APP_FRONT_URL = expectedUrl;

      const result = await service.createActivationToken(managerId);

      expect(result).toEqual({
        link: `${expectedUrl}/auth/activate/mocked_jwt_token`,
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

    it('should log an error to console if email service fails but return the link', async () => {
      const mockManager = Object.assign(new UserEntity(), {
        id: managerId,
        email: 'manager@example.com',
        name: 'John Doe',
      });

      jest
        .spyOn(mockUserService, 'findById')
        .mockResolvedValueOnce(mockManager);
      mockJwtService.sign.mockReturnValue('mocked_jwt_token');

      const emailError = new Error('SMTP Connection Failed');
      jest
        .spyOn(mockEmailService, 'sendMail')
        .mockRejectedValueOnce(emailError);

      const consoleSpy = jest.spyOn(console, 'error').mockImplementation();

      const result = await service.createActivationToken(managerId);

      expect(result.link).toBeDefined();

      await new Promise((resolve) => process.nextTick(resolve));

      expect(consoleSpy).toHaveBeenCalledWith(
        'Activation email failed to send:',
        emailError,
      );
      consoleSpy.mockRestore();
    });
  });

  describe('getAllUsers', () => {
    it('should combine users with their performance stats and return total count', async () => {
      const mockTotal = 2;

      const mockStats = { total: 10, completed: 10 };
      const mockPerformance = [
        {
          managerId: 1,
          total: 5,
          new: 2,
          agree: 3,
          in_work: 0,
          disagree: 0,
          dubbing: 0,
        },
      ];

      const user1 = { ...mockUserResDto, id: 1, name: 'User 1' };
      const user2 = { ...mockUserResDto, id: 2, name: 'User 2' };

      mockUserService.findAll.mockResolvedValue({
        items: [user1, user2],
        total: mockTotal,
      });

      mockOrdersService.getStatsByStatus.mockResolvedValue(mockStats);
      mockOrdersService.getManagersPerformance.mockResolvedValue(
        mockPerformance,
      );

      const result = await service.getAllUsers(1, 5);

      expect(result.users).toHaveLength(2);
      expect(result.total).toBe(mockTotal);

      expect(result.users[0].id).toBe(1);
      expect(result.users[0].stats.total).toBe(5);
      expect(result.users[0].stats.agree).toBe(3);

      expect(result.users[1].id).toBe(2);
      expect(result.users[1].stats.total).toBe(0);
      expect(result.users[1].stats.new).toBe(0);

      expect(result.stats).toEqual(mockStats);

      expect(mockUserService.findAll).toHaveBeenCalledWith(1, 5);
    });
    it('should use default pagination when arguments are missing', async () => {
      mockUserService.findAll.mockResolvedValue({ items: [], total: 0 });
      mockOrdersService.getStatsByStatus.mockResolvedValue({});
      mockOrdersService.getManagersPerformance.mockResolvedValue([]);

      await service.getAllUsers();

      expect(mockUserService.findAll).toHaveBeenCalledWith(1, 5);
    });
  });

  describe('disableUser', () => {
    it('should delegate disableUser to UserService.disable', async () => {
      mockUserService.disable.mockResolvedValue(mockUserResDto);

      const result = await service.disableUser(userId, currentUser);
      expect(mockUserService.disable).toHaveBeenCalledWith(userId, currentUser);
      expect(result).toEqual(mockUserResDto);
    });
  });
  describe('enableUser', () => {
    it('should delegate enableUser to UserService.enable', async () => {
      mockUserService.enable.mockResolvedValue(mockUserResDto);

      const result = await service.enableUser(userId, currentUser);
      expect(mockUserService.enable).toHaveBeenCalledWith(userId, currentUser);
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
