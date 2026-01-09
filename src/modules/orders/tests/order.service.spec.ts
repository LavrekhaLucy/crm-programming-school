import { Test } from '@nestjs/testing';
import { OrdersService } from '../services/order.service';
import { MockServiceType } from '../../../../test/types/mock-service.type';
import { OrdersRepository } from '../../repository/services/orders.repository';
import { mockResponseOrderDto } from '../__mocks__/res-order-dto.mock';
import { mockCreateOrderDto } from '../__mocks__/create-order-dto.mock';
import { mockCreatedEntity } from '../__mocks__/create-entity.mock';
import { usersModuleProviders } from '../../users/__mocks__/users-module.mock';

describe('OrderService', () => {
  let service: OrdersService;
  let repository: MockServiceType<OrdersRepository>;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [...usersModuleProviders, OrdersService],
    }).compile();
    service = module.get(OrdersService);
    repository = module.get(OrdersRepository);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('create', () => {
    it('should create an order', async () => {
      jest.spyOn(repository, 'create').mockReturnValue(mockCreatedEntity);
      repository.save.mockResolvedValue(mockResponseOrderDto);

      const result = await service.create(mockCreateOrderDto);

      expect(repository.create).toHaveBeenCalledWith(mockCreateOrderDto);
      expect(repository.save).toHaveBeenCalledWith(mockCreatedEntity);
      expect(result).toEqual(mockResponseOrderDto);
    });
  });
});
