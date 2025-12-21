import { Module } from '@nestjs/common';
import { UsersModule } from '../users/users.module';
import { OrdersModule } from '../orders/order.module';
import { AdminService } from './admin.service';
import { AdminController } from './admin.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from '../../database/entities/user.entity';

@Module({
  imports: [UsersModule, OrdersModule, TypeOrmModule.forFeature([UserEntity])],
  providers: [AdminService],
  controllers: [AdminController],
})
export class AdminModule {}
