import { Test } from '@nestjs/testing';
import { AdminService } from '../services/admin.service';
import { UserService } from '../../users/services/user.service';
import { OrdersService } from '../../orders/services/order.service';
import { mockUserService } from '../../users/__mocks__/user-service.mock';
import { mockOrdersService } from '../../orders/__mocks__/orders-service.mock';
import { mockCreateManagerReqDto } from '../__mocks__/create-manager-dto.mock';

describe('AdminService', () => {
  let service: AdminService;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        AdminService,
        {
          provide: UserService,
          useValue: mockUserService,
        },
        {
          provide: OrdersService,
          useValue: mockOrdersService,
        },
      ],
    }).compile();

    service = module.get(AdminService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });
  describe('createManager', () => {
    it('should delegate createManager to UserService', async () => {
      const createdUser = { id: 1 };
      mockUserService.create.mockResolvedValue(createdUser);

      const result = await service.createManager(mockCreateManagerReqDto);

      expect(mockUserService.create).toHaveBeenCalledWith(
        mockCreateManagerReqDto,
      );
      expect(result).toEqual(createdUser);
    });
  });
});
