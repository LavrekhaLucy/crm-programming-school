import { OrdersController } from '../order.controller';
import { Test } from '@nestjs/testing';
import { StatusesEnum } from '../../../database/entities/enums/statuses.enum';
import { ResponseOrderDto } from '../models/dto/res/response-order.dto';
import { UpdateOrderDto } from '../models/dto/req/update-order.dto';
import { UserRequest } from '../../auth/interfaces/user-request.interface';
import { mockCreateOrderDto } from '../__mocks__/create-order-dto.mock';
import { mockResponseOrderDto } from '../__mocks__/res-order-dto.mock';
import { usersModuleProviders } from '../../users/__mocks__/users-module.mock';
import { mockOrdersService } from '../__mocks__/orders-service.mock';

describe(OrdersController.name, () => {
  let ordersController: OrdersController;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      controllers: [OrdersController],
      providers: [...usersModuleProviders],
    }).compile();

    ordersController = module.get<OrdersController>(OrdersController);
  });

  it('should be defined', () => {
    expect(ordersController).toBeDefined();
  });
  describe('create', () => {
    it('should create order', async () => {
      const order = {
        id: 'order-id',
        ...mockCreateOrderDto,
        status: StatusesEnum.NEW,
      };

      mockOrdersService.create.mockResolvedValue(order);

      const result = await ordersController.create(mockCreateOrderDto);

      expect(mockOrdersService.create).toHaveBeenCalledWith(mockCreateOrderDto);
      expect(result).toEqual(order);
    });
  });
  describe('findAll', () => {
    it('should return all orders', async () => {
      mockOrdersService.findAll.mockResolvedValue([mockResponseOrderDto]);

      const result = await ordersController.findAll();

      expect(mockOrdersService.findAll).toHaveBeenCalledTimes(1);
      expect(result).toEqual([mockResponseOrderDto]);
    });
  });
  describe('findOne', () => {
    it('should return one order', async () => {
      const orderId = 'order-id';
      const expectedOrder: ResponseOrderDto = {
        ...mockResponseOrderDto,
        status: StatusesEnum.NEW,
      };
      mockOrdersService.findOne.mockResolvedValue(expectedOrder);

      const result = await ordersController.findOne(orderId);

      expect(mockOrdersService.findOne).toHaveBeenCalledWith(orderId);
      expect(result).toEqual(expectedOrder);
    });
  });
  describe('update', () => {
    it('should update order', async () => {
      const orderId = 'order-id';

      const mockUpdateDto: UpdateOrderDto = {
        status: StatusesEnum.AGREE,
      };

      const updatedOrder: ResponseOrderDto = {
        ...mockResponseOrderDto,
        status: StatusesEnum.AGREE,
      };

      mockOrdersService.update.mockResolvedValue(updatedOrder);

      const result = await ordersController.update(orderId, mockUpdateDto);
      expect(mockOrdersService.update).toHaveBeenCalledWith(
        orderId,
        mockUpdateDto,
      );
      expect(result).toEqual(updatedOrder);
    });
  });
  describe('assign', () => {
    it('should assign manager to order', async () => {
      const orderId = 'order-id';
      const managerId = 1;
      const order = { id: orderId, manager: { id: managerId } };

      mockOrdersService.assignManager.mockResolvedValue(order);

      const result = await ordersController.assignManager(orderId, managerId);

      expect(mockOrdersService.assignManager).toHaveBeenCalledWith(
        orderId,
        managerId,
      );
      expect(result).toEqual(order);
    });
  });
  describe('takeOrder', () => {
    it('should take order by manager', async () => {
      const orderId = 'order-id';

      const req = {
        user: {
          userId: 5,
        },
      } as UserRequest;

      const updateResult = { affected: 1 };

      mockOrdersService.takeOrder.mockResolvedValue(updateResult);

      const result = await ordersController.takeOrder(orderId, req);

      expect(mockOrdersService.takeOrder).toHaveBeenCalledWith(orderId, 5);
      expect(result).toEqual(updateResult);
    });
  });
  describe('delete', () => {
    it('should delete order', async () => {
      const orderId = 'order-id';

      mockOrdersService.delete.mockResolvedValue(undefined);

      const result = await ordersController.delete(orderId);

      expect(mockOrdersService.delete).toHaveBeenCalledWith(orderId);
      expect(result).toBeUndefined();
    });
  });
});
