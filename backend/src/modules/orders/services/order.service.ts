import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectEntityManager } from '@nestjs/typeorm';
import { EntityManager } from 'typeorm';
import { OrderEntity } from '../../../database/entities/order.entity';
import { CreateOrderDto } from '../models/dto/req/create-order.dto';
import { UpdateOrderDto } from '../models/dto/req/update-order.dto';
import { OrdersStatsDto } from '../models/dto/req/order-stats.dto';
import { StatusesEnum } from '../../../database/entities/enums/statuses.enum';
import { ResponseOrderDto } from '../models/dto/res/response-order.dto';
import { UserEntity } from '../../../database/entities/user.entity';
import { OrdersRepository } from '../../repository/services/orders.repository';
import { PaginatedResponse } from '../../../common/types/pagination.type';
import { OrdersQueryDto } from '../models/dto/req/orders-query.dto';
import { parseOrder } from '../utils/order-query.util';

@Injectable()
export class OrdersService {
  constructor(
    private readonly orderRepository: OrdersRepository,
    @InjectEntityManager()
    private readonly entityManager: EntityManager,
  ) {}

  async create(dto: CreateOrderDto): Promise<ResponseOrderDto> {
    const newOrder = this.orderRepository.create({
      ...dto,
      status: StatusesEnum.NEW,
    });
    return this.orderRepository.save(newOrder);
  }

  async findAll(
    query: OrdersQueryDto,
    userId: number,
  ): Promise<PaginatedResponse<OrderEntity>> {
    const {
      page = '1',
      limit = '25',
      order,
      name,
      surname,
      email,
      phone,
      age,
      startDate,
      endDate,

      course,
      course_format,
      course_type,
      status,
      group,

      onlyMine,
    } = query;

    const qb = this.orderRepository.createQueryBuilder('order');
    const { sortBy, sortOrder } = parseOrder(order);

    if (name)
      qb.andWhere('LOWER(order.name) LIKE :name', {
        name: `%${name.toLowerCase()}%`,
      });

    if (surname)
      qb.andWhere('LOWER(order.surname) LIKE :surname', {
        surname: `%${surname.toLowerCase()}%`,
      });

    if (email)
      qb.andWhere('LOWER(order.email) LIKE :email', {
        email: `%${email.toLowerCase()}%`,
      });

    if (phone)
      qb.andWhere('LOWER(order.phone) LIKE :phone', {
        phone: `%${phone.toLowerCase()}%`,
      });

    if (age) {
      qb.andWhere('order.age = :age', {
        age: Number(query.age),
      });
    }

    if (startDate) {
      qb.andWhere('order.created_at >= :startDate', { startDate });
    }

    if (endDate) {
      qb.andWhere('order.created_at <= :endDate', { endDate });
    }

    if (course) qb.andWhere('order.course = :course', { course });

    if (course_format)
      qb.andWhere('order.course_format = :course_format', { course_format });

    if (course_type)
      qb.andWhere('order.course_type = :course_type', { course_type });

    if (status) qb.andWhere('order.status = :status', { status });

    if (group) qb.andWhere('order.group = :group', { group });

    if (onlyMine === 'true') {
      qb.andWhere('order.managerId = :userId', { userId });
    }

    qb.orderBy(`order.${sortBy}`, sortOrder);

    qb.skip((+page - 1) * +limit);
    qb.take(+limit);

    const [data, total] = await qb.getManyAndCount();

    return {
      data,
      total,
      page: +page,
      limit: +limit,
    };
  }

  async findOne(id: string): Promise<ResponseOrderDto> {
    const order = await this.orderRepository.findOneBy({ id });
    if (!order) {
      throw new NotFoundException(`Order #${id} not found`);
    }
    return order;
  }

  async assignManager(orderId: string, managerId: number) {
    return this.entityManager.transaction(async (em) => {
      const orderRepository = em.getRepository(OrderEntity);

      const order = await orderRepository.findOne({
        where: { id: orderId },
      });
      if (!order) {
        throw new NotFoundException('Order not found');
      }
      const userRepository = em.getRepository(UserEntity);
      const manager = await userRepository.findOneBy({ id: managerId });

      if (!manager) {
        throw new NotFoundException('Manager not found');
      }

      order.manager = manager;
      return orderRepository.save(order);
    });
  }

  async takeOrder(orderId: string, managerId: number) {
    return this.entityManager.transaction(async (em) => {
      const orderRepository = em.getRepository(OrderEntity);
      const order = await orderRepository.findOne({
        where: { id: orderId },
        relations: ['manager'],
      });

      if (!order) {
        throw new NotFoundException('Order not found');
      }
      if (order.manager) {
        throw new BadRequestException('This order already has a manager.');
      }

      return await orderRepository.update(orderId, {
        manager: { id: managerId },
        status: StatusesEnum.INWORK,
      });
    });
  }

  async getStatsByStatus(): Promise<OrdersStatsDto[]> {
    const qb = this.orderRepository
      .createQueryBuilder('o')
      .select('o.status', 'status')
      .addSelect('COUNT(o.id)', 'count')
      .groupBy('o.status')
      .orderBy('COUNT(o.id)', 'DESC');

    const rows: Array<{ status: string; count: string | number }> =
      await qb.getRawMany();

    return rows
      .map((r) => {
        const rawCount = r.count;
        let count: number;
        if (typeof rawCount === 'string') {
          count = Number(rawCount);
        } else {
          count = Number(rawCount ?? 0);
        }

        return {
          status: r.status as StatusesEnum,
          count: Number.isNaN(count) ? 0 : count,
        };
      })
      .filter((item) => item.count > 0);
  }

  async update(id: string, dto: UpdateOrderDto): Promise<ResponseOrderDto> {
    const result = await this.orderRepository.update({ id }, dto);
    if (!result.affected) {
      throw new NotFoundException(`Order #${id} not found`);
    }
    return this.orderRepository.findOneBy({ id });
  }

  async delete(id: string): Promise<void> {
    const result = await this.orderRepository.delete(id);

    if (!result.affected) {
      throw new NotFoundException(`Order #${id} not found`);
    }
  }
}
