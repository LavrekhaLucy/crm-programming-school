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
import { OrdersQueryDto } from '../models/dto/req/orders-query.dto';
import {
  mockOrderEntities,
  mockOrderEntity,
} from '../__mocks__/mockOrderEntity';
import { OrdersMapper } from '../orders.mapper';
import { UpdateOrderDto } from '../models/dto/req/update-order.dto';
import { mockGroup } from '../__mocks__/group.mock';
import { mockManager } from '../__mocks__/manager.mock';

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
    it('should return paginated orders', async () => {
      const orders = mockOrderEntities;

      qb.getManyAndCount.mockResolvedValue([orders, 1]);

      const query: OrdersQueryDto = {
        name: 'john',
        surname: 'smith',
        email: 'test@mail.com',
        phone: '1234567890',
        age: '30',
        startDate: '2026-01-01',
        endDate: '2026-01-31',
        course: 'TS',
        course_format: 'online',
        course_type: 'minimal',
        status: 'new',
        group: 'group1',
      };

      const result = await service.findAll(query, 1);
      const andWhereSpy = jest.spyOn(qb, 'andWhere');

      await service.findAll(query, 1);

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

      expect(andWhereSpy.mock.calls).toContainEqual([
        'LOWER(order.name) LIKE :name',
        { name: '%john%' },
      ]);

      expect(andWhereSpy.mock.calls).toContainEqual([
        'LOWER(order.surname) LIKE :surname',
        { surname: '%smith%' },
      ]);

      expect(andWhereSpy.mock.calls).toContainEqual([
        'LOWER(order.email) LIKE :email',
        { email: '%test@mail.com%' },
      ]);

      expect(andWhereSpy.mock.calls).toContainEqual([
        'LOWER(order.phone) LIKE :phone',
        { phone: '%1234567890%' },
      ]);

      expect(andWhereSpy.mock.calls).toContainEqual([
        'order.age = :age',
        { age: 30 },
      ]);

      expect(andWhereSpy.mock.calls).toContainEqual([
        'order.created_at >= :startDate',
        { startDate: '2026-01-01' },
      ]);

      expect(andWhereSpy.mock.calls).toContainEqual([
        'order.created_at <= :endDate',
        { endDate: '2026-01-31' },
      ]);

      expect(andWhereSpy.mock.calls).toContainEqual([
        'order.course = :course',
        { course: 'TS' },
      ]);

      expect(andWhereSpy.mock.calls).toContainEqual([
        'order.course_format = :course_format',
        { course_format: 'online' },
      ]);

      expect(andWhereSpy.mock.calls).toContainEqual([
        'order.course_type = :course_type',
        { course_type: 'minimal' },
      ]);

      expect(andWhereSpy.mock.calls).toContainEqual([
        'order.status = :status',
        { status: 'new' },
      ]);

      expect(andWhereSpy.mock.calls).toContainEqual([
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

    it('should filter only mine orders', async () => {
      qb.getManyAndCount.mockResolvedValue([[], 0]);

      const query: OrdersQueryDto = {
        onlyMine: 'true',
      };

      const andWhereSpy = jest.spyOn(qb, 'andWhere');

      await service.findAll(query, 5);

      expect(andWhereSpy.mock.calls).toContainEqual([
        'order.managerId = :userId',
        { userId: 5 },
      ]);
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
        'COUNT(o.id)',
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

      const existingOrder = { ...mockOrderEntity, group: null, manager: null };

      const updateDto: UpdateOrderDto = {
        ...mockCreateOrderDto,
        group: 3,
        manager: 1,
      };

      const expectedOrderToSave = {
        ...existingOrder,
        group: { id: 3 },
        manager: { id: 1 },
      };

      const fullUpdatedOrder = {
        ...existingOrder,
        group: mockGroup,
        manager: mockManager,
      };

      mockOrderRepository.findOne
        .mockResolvedValueOnce(existingOrder)
        .mockResolvedValueOnce(fullUpdatedOrder);

      mockOrderRepository.save.mockResolvedValue(fullUpdatedOrder);

      const result = await service.update(orderId, updateDto);

      expect(mockOrderRepository.findOne).toHaveBeenNthCalledWith(1, {
        where: { id: orderId },
      });

      expect(mockOrderRepository.save).toHaveBeenCalledWith(
        expect.objectContaining(expectedOrderToSave),
      );

      expect(mockOrderRepository.findOne).toHaveBeenNthCalledWith(2, {
        where: { id: orderId },
        relations: ['group', 'manager'],
      });

      expect(result).toEqual(OrdersMapper.toResDto(fullUpdatedOrder));
    });

    it('should throw NotFoundException if order not found', async () => {
      const orderId = 'missingOrder';
      const updateDto: UpdateOrderDto = {
        ...mockCreateOrderDto,
        group: 3,
        manager: 1,
      };
      mockOrderRepository.findOne.mockResolvedValue(null);

      await expect(service.update(orderId, updateDto)).rejects.toThrow(
        NotFoundException,
      );

      expect(mockOrderRepository.save).not.toHaveBeenCalled();
      expect(mockOrderRepository.findOne).toHaveBeenCalledTimes(1);
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
