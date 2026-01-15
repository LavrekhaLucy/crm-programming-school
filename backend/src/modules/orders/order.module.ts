import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OrderEntity } from '../../database/entities/order.entity';
import { OrdersService } from './services/order.service';
import { OrdersController } from './order.controller';
import { UsersModule } from '../users/users.module';
import { OrdersRepository } from '../repository/services/orders.repository';

@Module({
  imports: [TypeOrmModule.forFeature([OrderEntity]), UsersModule],
  providers: [OrdersService, OrdersRepository],
  controllers: [OrdersController],
  exports: [OrdersService],
})
export class OrdersModule {}
