import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Param,
  Body,
  ParseIntPipe,
} from '@nestjs/common';
import { OrdersService } from './services/order.service';
import { CreateOrderDto } from './models/dto/create-order.dto';
import { OrderEntity } from '../../database/entities/orders/order.entity';
import { UpdateOrderDto } from './models/dto/update-order.dto';

@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Post()
  create(@Body() dto: CreateOrderDto): Promise<OrderEntity> {
    return this.ordersService.create(dto);
  }

  @Get()
  findAll(): Promise<OrderEntity[]> {
    return this.ordersService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number): Promise<OrderEntity> {
    return this.ordersService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateOrderDto,
  ): Promise<OrderEntity> {
    return this.ordersService.update(id, dto);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number): Promise<void> {
    return this.ordersService.remove(id);
  }
}
