import { Module } from '@nestjs/common';
import { AdminService } from './services/admin.service';
import { AdminController } from './admin.controller';
import { UsersModule } from '../users/users.module';
import { OrdersModule } from '../orders/order.module';

@Module({
  imports: [UsersModule, OrdersModule],
  providers: [AdminService],
  controllers: [AdminController],
})
export class AdminModule {}
