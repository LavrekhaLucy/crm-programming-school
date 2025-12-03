import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { OrderEntity } from '../../../database/entities/orders/order.entity';
import { CreateOrderDto } from '../models/dto/create-order.dto';
import { UpdateOrderDto } from '../models/dto/update-order.dto';

@Injectable()
export class OrdersService {
  constructor(
    @InjectRepository(OrderEntity)
    private readonly orderRepo: Repository<OrderEntity>,
  ) {}

  async create(dto: CreateOrderDto): Promise<OrderEntity> {
    const order = this.orderRepo.create(dto);
    return this.orderRepo.save(order);
  }

  async findAll(): Promise<OrderEntity[]> {
    return this.orderRepo.find();
  }

  async findOne(id: number): Promise<OrderEntity> {
    const order = await this.orderRepo.findOne({ where: { id } });
    if (!order) throw new NotFoundException(`Order #${id} not found`);
    return order;
  }

  async update(id: number, dto: UpdateOrderDto): Promise<OrderEntity> {
    const order = await this.findOne(id);
    Object.assign(order, dto);
    return this.orderRepo.save(order);
  }

  async remove(id: number): Promise<void> {
    const result = await this.orderRepo.delete(id);
    if (result.affected === 0)
      throw new NotFoundException(`Order #${id} not found`);
  }
}
