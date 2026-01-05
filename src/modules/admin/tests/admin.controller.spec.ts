import { AdminController } from '../admin.controller';
import { Test } from '@nestjs/testing';
import { AdminService } from '../services/admin.service';
import { UserRoleEnum } from '../../../database/entities/enums/user-role.enum';
import { UserBaseResDto } from '../../users/models/dto/res/user-base.res.dto';
import { StatusesEnum } from '../../../database/entities/enums/statuses.enum';

describe(AdminController.name, () => {
  let adminController: AdminController;

  let mockAdminService: {
    createManager: jest.Mock;
    getAllUsers: jest.Mock;
    disableUser: jest.Mock;
    enableUser: jest.Mock;
    getAllOrders: jest.Mock;
    getOrdersStats: jest.Mock;
  };

  const mockUserBaseResDto: UserBaseResDto = {
    id: 1,
    email: 'email',
    name: 'name',
    role: UserRoleEnum.MANAGER,
    avatarUrl: null,
    locale: 'en',
    isAdultAccepted: true,
  };

  beforeEach(async () => {
    mockAdminService = {
      createManager: jest.fn(),
      getAllUsers: jest.fn(),
      disableUser: jest.fn(),
      enableUser: jest.fn(),
      getAllOrders: jest.fn(),
      getOrdersStats: jest.fn(),
    };
    const module = await Test.createTestingModule({
      controllers: [AdminController],
      providers: [
        {
          provide: AdminService,
          useValue: mockAdminService,
        },
      ],
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
      const mockCreateManagerResDto = {
        id: 1,
        email: 'email',
        name: 'name',
        surname: 'surname',
        username: 'username',
        password: 'password',
        role: UserRoleEnum.MANAGER,
      };
      jest
        .spyOn(mockAdminService, 'createManager')
        .mockResolvedValue(mockCreateManagerResDto);

      const result = await adminController.createManager(
        mockCreateManagerResDto,
      );

      expect(mockAdminService.createManager).toHaveBeenCalledWith(
        mockCreateManagerResDto,
      );
      expect(result).toEqual(mockCreateManagerResDto);
    });
  });
  describe('getAllUsers', () => {
    it('should return all users', async () => {
      jest
        .spyOn(mockAdminService, 'getAllUsers')
        .mockResolvedValue([mockUserBaseResDto]);

      const result = await adminController.getAllUsers();

      expect(mockAdminService.getAllUsers).toHaveBeenCalledTimes(1);
      expect(result).toEqual([mockUserBaseResDto]);
    });
  });
  describe('disableUser', () => {
    it('should disable user', async () => {
      const userId = 1;

      jest
        .spyOn(mockAdminService, 'disableUser')
        .mockResolvedValue(mockUserBaseResDto);

      const result = await adminController.disable(userId);

      expect(mockAdminService.disableUser).toHaveBeenCalledTimes(1);
      expect(mockAdminService.disableUser).toHaveBeenCalledWith(userId);
      expect(result).toEqual(mockUserBaseResDto);
    });
  });
  describe('enableUser', () => {
    it('should enable user', async () => {
      const userId = 1;
      jest
        .spyOn(mockAdminService, 'enableUser')
        .mockResolvedValue(mockUserBaseResDto);

      const result = await adminController.enable(userId);

      expect(mockAdminService.enableUser).toHaveBeenCalledTimes(1);
      expect(mockAdminService.enableUser).toHaveBeenCalledWith(userId);
      expect(result).toEqual(mockUserBaseResDto);
    });
  });
  describe('getDashboard', () => {
    it('should return dashboard message', () => {
      const result = adminController.getDashboard();
      expect(result).toEqual({ message: 'Admin dashboard доступний' });
    });
  });
  describe('getAllOrders', () => {
    it('should call adminService.getAllOrders', async () => {
      const mockResponseOrderDto = {
        id: 1,
        items: [],
        totalPrice: 100,
        status: 'pending',
        createdAt: new Date('2024-01-01'),
        updatedAt: new Date('2024-01-01'),
      };

      jest
        .spyOn(mockAdminService, 'getAllOrders')
        .mockResolvedValue([mockResponseOrderDto]);

      await adminController.getAllOrders();
      expect(mockAdminService.getAllOrders).toHaveBeenCalledTimes(1);
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
