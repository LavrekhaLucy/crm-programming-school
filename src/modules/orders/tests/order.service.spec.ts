import { Test } from '@nestjs/testing';
import { OrdersService } from '../services/order.service';
import { MockServiceType } from '../../../../test/types/mock-service.type';
import { OrdersRepository } from '../../repository/services/orders.repository';
import { mockResponseOrderDto } from '../__mocks__/res-order-dto.mock';
import { mockCreateOrderDto } from '../__mocks__/create-order-dto.mock';
import { mockCreatedEntity } from '../__mocks__/create-entity.mock';
import { usersModuleProviders } from '../../users/__mocks__/users-module.mock';
import { NotFoundException } from '@nestjs/common';
import { mockOrderRepository } from '../__mocks__/order-repository.mock';
import { mockUserRepository } from '../../users/__mocks__/user-repository.mock';
import { UserEntity } from '../../../database/entities/user.entity';
import { OrderEntity } from '../../../database/entities/order.entity';
import { mockOrderRepoFindOne } from '../__mocks__/order-repo-find-one.mock';
import { StatusesEnum } from '../../../database/entities/enums/statuses.enum';
import { mockEntityManager } from '../__mocks__/entity-manager.mock';
import { mockUpdateResult } from '../__mocks__/update-result.mock';
import { mockQueryBuilder } from '../__mocks__/query-builder.mock';
import { SelectQueryBuilder } from 'typeorm';
import { mockUpdateOrderDto } from '../__mocks__/update-order-dto.mock';

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
  describe('findAll', () => {
    it('should return an array of orders', async () => {
      repository.find.mockResolvedValue([mockResponseOrderDto]);

      const result = await service.findAll();

      expect(repository.find).toHaveBeenCalledTimes(1);
      expect(result).toEqual([mockResponseOrderDto]);
    });
  });
  describe('findOne', () => {
    beforeEach(() => {
      jest.clearAllMocks();
    });
    it('should return a single order by id', async () => {
      repository.findOneBy.mockResolvedValue(mockResponseOrderDto);
      const result = await service.findOne('order-id-123');

      expect(repository.findOneBy).toHaveBeenCalledWith({ id: 'order-id-123' });
      expect(result).toEqual(mockResponseOrderDto);
    });

    it('should throw NotFoundException if order not found', async () => {
      repository.findOneBy.mockResolvedValue(null);
      await expect(service.findOne('non-existent-id')).rejects.toThrow(
        NotFoundException,
      );
    });
  });
  describe('assignManager', () => {
    beforeEach(() => {
      jest.clearAllMocks();
    });
    it('should assign manager to order', async () => {
      (mockOrderRepository.findOne as jest.Mock).mockResolvedValue(
        mockOrderRepoFindOne,
      );
      (mockUserRepository.findOneBy as jest.Mock).mockResolvedValue({
        id: 42,
      } as UserEntity);
      (mockOrderRepository.save as jest.Mock).mockResolvedValue({
        id: 'order1',
        manager: { id: 42 },
      });

      const result = await service.assignManager('order1', 42);
      expect(mockEntityManager.transaction).toHaveBeenCalled();

      expect(mockOrderRepository.findOne).toHaveBeenCalledWith(
        expect.objectContaining({
          where: { id: 'order1' },
        }),
      );

      expect(result.manager.id).toBe(42);
    });

    it('should throw NotFoundException if order not found', async () => {
      mockOrderRepository.findOne.mockResolvedValue(null);

      await expect(service.assignManager('missingOrder', 42)).rejects.toThrow(
        'Order not found',
      );
      expect(mockOrderRepository.save).not.toHaveBeenCalled();
    });

    it('should throw NotFoundException if manager not found', async () => {
      mockOrderRepository.findOne.mockResolvedValue({
        id: 'order1',
      } as OrderEntity);
      mockUserRepository.findOneBy.mockResolvedValue(null);

      await expect(service.assignManager('order1', 999)).rejects.toThrow(
        'Manager not found',
      );
    });
  });
  describe('takeOrder', () => {
    beforeEach(() => {
      jest.clearAllMocks();
    });
    it('should allow manager to take an unassigned order', async () => {
      mockOrderRepository.findOne.mockResolvedValue({
        id: 'order2',
        manager: null,
        status: StatusesEnum.NEW,
      } as OrderEntity);

      mockOrderRepository.update.mockResolvedValue(mockUpdateResult);

      await service.takeOrder('order2', 43);

      expect(mockEntityManager.transaction).toHaveBeenCalled();
      expect(mockOrderRepository.update).toHaveBeenCalledWith('order2', {
        manager: { id: 43 },
        status: StatusesEnum.INWORK,
      });
    });

    it('should throw NotFoundException if order not found', async () => {
      mockOrderRepository.findOne.mockResolvedValue(null);

      await expect(service.takeOrder('missingOrder', 42)).rejects.toThrow(
        NotFoundException,
      );

      expect(mockOrderRepository.update).not.toHaveBeenCalled();
    });

    it('should throw BadRequestException if order already has a manager', async () => {
      mockOrderRepository.findOne.mockResolvedValue({
        id: 'order3',
        manager: { id: 50 },
        status: StatusesEnum.INWORK,
      } as OrderEntity);

      await expect(service.takeOrder('order3', 43)).rejects.toThrow(
        'This order already has a manager.',
      );
      expect(mockOrderRepository.update).not.toHaveBeenCalled();
    });
  });
  describe('getStatsByStatus', () => {
    beforeEach(() => {
      jest.clearAllMocks();
    });

    it('should return mapped and filtered statistics by status', async () => {
      const customRows = [
        { status: StatusesEnum.NEW, count: '10' },
        { status: StatusesEnum.INWORK, count: 5 },
        { status: StatusesEnum.AGREE, count: '0' },
        { status: StatusesEnum.DISAGREE, count: null },
        { status: StatusesEnum.NEW, count: undefined },
        { status: StatusesEnum.INWORK, count: 'abc' },
      ];

      const orderQB = mockQueryBuilder<OrderEntity>();

      orderQB.getRawMany.mockResolvedValue(customRows);

      jest
        .spyOn(mockOrderRepository, 'createQueryBuilder')
        .mockReturnValue(orderQB as unknown as SelectQueryBuilder<OrderEntity>);

      const result = await service.getStatsByStatus();

      expect(mockOrderRepository.createQueryBuilder).toHaveBeenCalledWith('o');
      expect(result).toHaveLength(2);
      expect(result).toEqual([
        { status: StatusesEnum.NEW, count: 10 },
        { status: StatusesEnum.INWORK, count: 5 },
      ]);

      expect(jest.spyOn(orderQB, 'select')).toHaveBeenCalledWith(
        'o.status',
        'status',
      );
      expect(jest.spyOn(orderQB, 'addSelect')).toHaveBeenCalledWith(
        'COUNT(o.id)',
        'count',
      );
      expect(jest.spyOn(orderQB, 'groupBy')).toHaveBeenCalledWith('o.status');
      expect(jest.spyOn(orderQB, 'orderBy')).toHaveBeenCalledWith(
        'count',
        'DESC',
      );
    });

    it('should return an empty array if database returns no rows', async () => {
      const orderQB = mockQueryBuilder<OrderEntity>();
      orderQB.getRawMany.mockResolvedValue([]);

      jest
        .spyOn(mockOrderRepository, 'createQueryBuilder')
        .mockReturnValue(orderQB as unknown as SelectQueryBuilder<OrderEntity>);

      const result = await service.getStatsByStatus();

      expect(result).toEqual([]);
      expect(result).toHaveLength(0);
    });
  });
  describe('update', () => {
    it('should update order and return updated order', async () => {
      const orderId = 'orderId';

      mockOrderRepository.update.mockResolvedValue(mockUpdateResult);
      mockOrderRepository.findOneBy.mockResolvedValue(mockUpdateOrderDto);

      const result = await service.update(orderId, mockCreateOrderDto);

      expect(mockOrderRepository.update).toHaveBeenCalledWith(
        { id: orderId },
        mockCreateOrderDto,
      );
      expect(mockOrderRepository.findOneBy).toHaveBeenCalledWith({
        id: orderId,
      });
      expect(result).toEqual(mockUpdateOrderDto);
    });

    it('should throw NotFoundException if order not found', async () => {
      const orderId = 'missingOrder';

      mockOrderRepository.update.mockResolvedValue({
        ...mockUpdateResult,
        affected: 0,
      });

      await expect(
        service.update(orderId, { status: StatusesEnum.DISAGREE }),
      ).rejects.toThrow(NotFoundException);

      expect(mockOrderRepository.findOneBy).not.toHaveBeenCalled();
    });
  });
  describe('delete', () => {
    it('should delete order successfully', async () => {
      const orderId = 'order1';

      mockOrderRepository.delete.mockResolvedValue(mockUpdateResult);

      await expect(service.delete(orderId)).resolves.not.toThrow();

      expect(mockOrderRepository.delete).toHaveBeenCalledWith(orderId);
    });

    it('should throw NotFoundException if order not found', async () => {
      const orderId = 'missingOrder';

      mockOrderRepository.delete.mockResolvedValue({
        ...mockUpdateResult,
        affected: 0,
      });

      await expect(service.delete(orderId)).rejects.toThrow(NotFoundException);
    });
  });
});
