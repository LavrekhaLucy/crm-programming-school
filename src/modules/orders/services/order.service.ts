import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { OrderEntity } from '../../../database/entities/order.entity';
import { CreateOrderDto } from '../models/dto/req/create-order.dto';
import { UpdateOrderDto } from '../models/dto/req/update-order.dto';
import { OrdersStatsDto } from '../models/dto/req/order-stats.dto';
import { StatusesEnum } from '../../../database/entities/enums/statuses.enum';
import { ResponseOrderDto } from '../models/dto/res/response-order.dto';

@Injectable()
export class OrdersService {
  constructor(
    @InjectRepository(OrderEntity)
    private readonly orderRepository: Repository<OrderEntity>,
  ) {}

  async create(dto: CreateOrderDto): Promise<OrderEntity> {
    const newOrder = this.orderRepository.create(dto);
    return this.orderRepository.save(newOrder);
  }

  async findAll(): Promise<ResponseOrderDto[]> {
    return this.orderRepository.find();
  }

  async findOne(id: number): Promise<OrderEntity> {
    const order = await this.orderRepository.findOneBy({ id });
    if (!order) {
      throw new NotFoundException(`Order #${id} not found`);
    }
    return order;
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

    // Повертаємо тільки ті статуси, які є в результаті запиту (без нулів)
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

  async update(id: number, dto: UpdateOrderDto): Promise<OrderEntity> {
    await this.orderRepository.update({ id }, dto);
    return this.orderRepository.findOneBy({ id });
  }

  async delete(id: number): Promise<void> {
    const result = await this.orderRepository.delete(id);

    if (!result) {
      throw new NotFoundException(`Order #${id} not found`);
    }
  }
}
