import { Test } from '@nestjs/testing';
import { OrdersService } from '../services/order.service';
import { OrdersRepository } from '../../repository/services/orders.repository';
import { mockResponseOrderDto } from '../__mocks__/res-order-dto.mock';
import { mockCreateOrderDto } from '../__mocks__/create-order-dto.mock';
import { mockCreatedEntity } from '../__mocks__/create-entity.mock';
import { usersModuleProviders } from '../../users/__mocks__/users-module.mock';
import { ForbiddenException, NotFoundException } from '@nestjs/common';
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
import { OrdersQueryDto } from '../models/dto/req/orders-query.dto';
import {
  mockOrderEntities,
  mockOrderEntity,
} from '../__mocks__/mockOrderEntity';
import { UpdateOrderDto } from '../models/dto/req/update-order.dto';
import { mockOrdersQuery } from '../__mocks__/orders-query.mock';
import { MockServiceType } from '../../../types/mock-service.type';
import { GroupEntity } from '../../../database/entities/group.entity';
import { makeOrder } from '../__mocks__/make-order.mock';

describe('OrderService', () => {
  let service: OrdersService;
  let repository: MockServiceType<OrdersRepository>;
  let qb: jest.Mocked<SelectQueryBuilder<OrderEntity>>;

  beforeEach(async () => {
    qb = mockQueryBuilder<OrderEntity>();

    const module = await Test.createTestingModule({
      providers: [...usersModuleProviders, OrdersService],
    }).compile();
    service = module.get(OrdersService);
    repository = module.get(OrdersRepository);

    jest.spyOn(repository, 'createQueryBuilder').mockReturnValue(qb);
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
    it('should return paginated orders with all filters applied', async () => {
      const orders = mockOrderEntities;
      qb.getManyAndCount.mockResolvedValue([orders, 1]);

      const result = await service.findAll(mockOrdersQuery, 1);

      expect(repository.createQueryBuilder).toHaveBeenCalledWith('order');

      expect(jest.spyOn(qb, 'leftJoinAndSelect')).toHaveBeenCalledWith(
        'order.group',
        'group',
      );
      expect(jest.spyOn(qb, 'leftJoinAndSelect')).toHaveBeenCalledWith(
        'order.manager',
        'manager',
      );

      expect(jest.spyOn(qb, 'skip')).toHaveBeenCalledWith(0);
      expect(jest.spyOn(qb, 'take')).toHaveBeenCalledWith(25);

      const andWhereCalls = qb.andWhere.mock.calls;

      expect(andWhereCalls).toContainEqual([
        'LOWER(order.name) LIKE :name',
        { name: '%john%' },
      ]);

      expect(andWhereCalls).toContainEqual([
        'LOWER(order.surname) LIKE :surname',
        { surname: '%smith%' },
      ]);

      expect(andWhereCalls).toContainEqual(['order.age = :age', { age: 30 }]);

      expect(andWhereCalls).toContainEqual([
        'order.group = :group',
        { group: 'group1' },
      ]);

      expect(result).toEqual({
        data: orders,
        total: 1,
        page: 1,
        limit: 25,
      });
    });

    it('should filter by specific status', async () => {
      const qb = mockQueryBuilder<OrderEntity>();
      qb.getManyAndCount.mockResolvedValue([mockOrderEntities, 1]);

      jest
        .spyOn(repository, 'createQueryBuilder')
        .mockReturnValue(qb as unknown as SelectQueryBuilder<OrderEntity>);

      const queryWithInWorkStatus = { ...mockOrdersQuery, status: 'in_work' };

      const result = await service.findAll(queryWithInWorkStatus, 1);

      expect(jest.spyOn(qb, 'andWhere')).toHaveBeenCalledWith(
        'order.status = :status',
        {
          status: 'in_work',
        },
      );
      expect(result.data).toEqual(mockOrderEntities);
      expect(result.total).toBe(1);
    });

    it('should filter only mine orders', async () => {
      qb.getManyAndCount.mockResolvedValue([[], 0]);

      const query: OrdersQueryDto = {
        onlyMine: 'true',
      };

      const andWhereSpy = jest.spyOn(qb, 'andWhere');

      await service.findAll(query, 5);

      expect(andWhereSpy.mock.calls).toContainEqual([
        'manager.id = :userId',
        { userId: 5 },
      ]);
    });
  });
  describe('exportToExcel', () => {
    it('should generate an excel buffer', async () => {
      qb.getMany.mockResolvedValue(mockOrderEntities);

      let result = await service.exportToExcel(mockOrdersQuery, 1);
      expect(result).toBeInstanceOf(Buffer);

      const mockWithoutDate = [{ ...mockOrderEntity, created_at: null }];
      qb.getMany.mockResolvedValue(mockWithoutDate as OrderEntity[]);

      result = await service.exportToExcel(mockOrdersQuery, 1);

      expect(result).toBeInstanceOf(Buffer);
      expect(jest.spyOn(qb, 'leftJoinAndSelect')).toHaveBeenCalledWith(
        'order.group',
        'group',
      );
      expect(jest.spyOn(qb, 'getMany')).toHaveBeenCalledTimes(2);
      expect(jest.spyOn(qb, 'skip')).not.toHaveBeenCalled();
      expect(jest.spyOn(qb, 'take')).not.toHaveBeenCalled();
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

      const transactionSpy = jest.spyOn(mockEntityManager, 'transaction');

      expect(transactionSpy).toHaveBeenCalledTimes(1);

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

      const transactionSpy = jest.spyOn(mockEntityManager, 'transaction');

      expect(transactionSpy).toHaveBeenCalledTimes(1);

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

    it('should return valid statistics', async () => {
      const customRows = [
        { status: StatusesEnum.NEW, count: '10' },
        { status: StatusesEnum.INWORK, count: 5 },
      ];

      const orderQB = mockQueryBuilder<OrderEntity>();
      orderQB.getRawMany.mockResolvedValue(customRows);
      jest
        .spyOn(mockOrderRepository, 'createQueryBuilder')
        .mockReturnValue(orderQB as unknown as SelectQueryBuilder<OrderEntity>);

      jest.spyOn(mockOrderRepository, 'count').mockResolvedValue(15);

      const result = await service.getStatsByStatus();

      expect(mockOrderRepository.createQueryBuilder).toHaveBeenCalledWith('o');
      expect(mockOrderRepository.count).toHaveBeenCalled();

      expect(result).toEqual({
        total: 15,
        new: 10,
        in_work: 5,
        agree: 0,
        disagree: 0,
        dubbing: 0,
        // null: 0,
      });
    });

    it('should handle empty database', async () => {
      const orderQB = mockQueryBuilder<OrderEntity>();
      orderQB.getRawMany.mockResolvedValue([]);
      jest.spyOn(mockOrderRepository, 'count').mockResolvedValue(0);

      jest
        .spyOn(mockOrderRepository, 'createQueryBuilder')
        .mockReturnValue(orderQB as unknown as SelectQueryBuilder<OrderEntity>);

      const result = await service.getStatsByStatus();

      expect(result).toEqual({
        total: 0,
        new: 0,
        in_work: 0,
        agree: 0,
        disagree: 0,
        dubbing: 0,
        // null: 0,
      });
    });

    it('should handle invalid counts and unknown statuses', async () => {
      const customRows = [
        { status: StatusesEnum.NEW, count: '10' },
        { status: StatusesEnum.INWORK, count: 'abc' },
        { status: StatusesEnum.AGREE, count: null },
        { status: 'unknown_status', count: '100' },
      ];

      const orderQB = mockQueryBuilder<OrderEntity>();
      orderQB.getRawMany.mockResolvedValue(customRows);
      jest.spyOn(mockOrderRepository, 'count').mockResolvedValue(10);

      jest
        .spyOn(mockOrderRepository, 'createQueryBuilder')
        .mockReturnValue(orderQB as unknown as SelectQueryBuilder<OrderEntity>);

      const result = await service.getStatsByStatus();

      expect(result.new).toBe(10);
      expect(result.in_work).toBe(0);
      expect(result.agree).toBe(0);
      expect(result).not.toHaveProperty('unknown_status');
    });

    it('should correctly sum NEW status and NULL status into "new" field', async () => {
      const customRows = [
        { status: StatusesEnum.NEW, count: '10' },
        { status: null, count: '5' },
        { status: StatusesEnum.INWORK, count: '3' },
      ];

      const orderQB = mockQueryBuilder<OrderEntity>();
      orderQB.getRawMany.mockResolvedValue(customRows);
      jest.spyOn(mockOrderRepository, 'count').mockResolvedValue(15);

      jest
        .spyOn(mockOrderRepository, 'createQueryBuilder')
        .mockReturnValue(orderQB as unknown as SelectQueryBuilder<OrderEntity>);

      const result = await service.getStatsByStatus();

      expect(result.new).toBe(15);
      expect(result.in_work).toBe(3);
    });

    it('should gracefully skip unknown statuses and keep stats at 0', async () => {
      const customRows = [
        { status: 'some_weird_status_that_does_not_exist', count: '99' },
      ];

      const orderQB = mockQueryBuilder<OrderEntity>();
      orderQB.getRawMany.mockResolvedValue(customRows);
      jest.spyOn(mockOrderRepository, 'count').mockResolvedValue(0);

      jest
        .spyOn(mockOrderRepository, 'createQueryBuilder')
        .mockReturnValue(orderQB as unknown as SelectQueryBuilder<OrderEntity>);

      const result = await service.getStatsByStatus();
      expect(result).toEqual({
        total: 0,
        new: 0,
        in_work: 0,
        agree: 0,
        disagree: 0,
        dubbing: 0,
      });
    });
  });

  describe('update', () => {
    const order = makeOrder();
    const mockUser = { id: 13 } as UserEntity;

    beforeEach(() => {
      jest.clearAllMocks();
    });

    it('should throw NotFoundException if order does not exist', async () => {
      repository.findOne.mockResolvedValueOnce(null);

      await expect(
        service.update('1', mockUser, {} as UpdateOrderDto),
      ).rejects.toThrow(NotFoundException);
    });

    it('should throw ForbiddenException if order already has a manager (not the current user)', async () => {
      const otherManager = { id: 99 } as UserEntity;

      repository.findOne.mockResolvedValueOnce(
        makeOrder({ manager: otherManager }),
      );

      await expect(
        service.update('1', mockUser, {
          status: StatusesEnum.INWORK,
        } as UpdateOrderDto),
      ).rejects.toThrow(ForbiddenException);
    });

    it('should set manager to null when status is NEW', async () => {
      const initialOrder = { id: '1', manager: { id: 13 } } as OrderEntity;

      repository.findOne.mockResolvedValueOnce(initialOrder);
      repository.save.mockResolvedValue({ ...initialOrder, manager: null });
      repository.findOne.mockResolvedValueOnce({
        ...initialOrder,
        manager: null,
      });
      await service.update('1', mockUser, { status: StatusesEnum.NEW });

      expect(repository.save).toHaveBeenCalledWith(
        expect.objectContaining({
          manager: null,
        }),
      );
    });

    it('should assign manager if manager id provided', async () => {
      repository.findOne
        .mockResolvedValueOnce(order)
        .mockResolvedValueOnce(makeOrder({ manager: { id: 5 } as UserEntity }));

      repository.save.mockResolvedValue(
        makeOrder({ manager: { id: 5 } as UserEntity }),
      );

      await service.update('1', mockUser, { manager: 5 });

      expect(repository.save).toHaveBeenCalledWith(
        expect.objectContaining({
          manager: { id: 5 },
        }),
      );
    });

    it('should update group if provided', async () => {
      const order = makeOrder();

      repository.findOne
        .mockResolvedValueOnce(order)
        .mockResolvedValueOnce(makeOrder({ group: { id: 10 } as GroupEntity }));

      repository.save.mockResolvedValue(
        makeOrder({ group: { id: 10 } as GroupEntity }),
      );

      await service.update('1', mockUser, { group: 10 });

      expect(repository.save).toHaveBeenCalledWith(
        expect.objectContaining({
          group: { id: 10 },
        }),
      );
    });
    it('should update other fields using Object.assign', async () => {
      const order = makeOrder({ name: 'Old' });

      repository.findOne
        .mockResolvedValueOnce(order)
        .mockResolvedValueOnce(makeOrder({ name: 'New' }));

      repository.save.mockResolvedValue(makeOrder({ name: 'New' }));

      await service.update('1', mockUser, { name: 'New' } as UpdateOrderDto);

      expect(repository.save).toHaveBeenCalledWith(
        expect.objectContaining({
          name: 'New',
        }),
      );
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
