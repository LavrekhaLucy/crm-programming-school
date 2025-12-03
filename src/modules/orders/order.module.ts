import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OrderEntity } from '../../database/entities/orders/order.entity';
import { OrdersService } from './services/order.service';
import { OrdersController } from './order.controller';

@Module({
  imports: [TypeOrmModule.forFeature([OrderEntity])],
  providers: [OrdersService],
  controllers: [OrdersController],
})
export class OrdersModule {}
