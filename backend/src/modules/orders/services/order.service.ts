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

@Injectable()
export class OrdersService {
  constructor(
    private readonly orderRepository: OrdersRepository,
    @InjectEntityManager()
    private readonly entityManager: EntityManager,
  ) {}

  async create(dto: CreateOrderDto): Promise<ResponseOrderDto> {
    const newOrder = this.orderRepository.create(dto);
    return this.orderRepository.save(newOrder);
  }

  async findAll(page = 1, limit = 10): Promise<PaginatedResponse<OrderEntity>> {
    const [data, total] = await this.orderRepository.findAndCount({
      skip: (page - 1) * limit,
      take: limit,
    });
    return { data, total, page, limit };
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
      .orderBy('count', 'DESC');

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
