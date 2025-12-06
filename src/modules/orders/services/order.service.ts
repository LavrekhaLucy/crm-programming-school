import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { OrderEntity } from '../../../database/entities/orders/order.entity';
import { CreateOrderDto } from '../models/dto/req/create-order.dto';
import { UpdateOrderDto } from '../models/dto/req/update-order.dto';

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

  async findAll(): Promise<OrderEntity[]> {
    return this.orderRepository.find();
  }

  async findOne(id: number): Promise<OrderEntity> {
    const order = await this.orderRepository.findOne({ where: { id } });
    if (!order) {
      throw new NotFoundException(`Order #${id} not found`);
    }
    return order;
  }

  async update(id: number, dto: UpdateOrderDto): Promise<OrderEntity> {
    await this.orderRepository.update(id, dto);
    return this.findOne(id);
  }

  async delete(id: number): Promise<void> {
    const result = await this.orderRepository.delete(id);

    if (!result) {
      throw new NotFoundException(`Order #${id} not found`);
    }
  }
}
