import { Module } from '@nestjs/common';
import { AdminService } from './services/admin.service';
import { AdminController } from './admin.controller';
import { UsersModule } from '../users/users.module';
import { OrdersModule } from '../orders/order.module';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [UsersModule, OrdersModule, AuthModule],
  providers: [AdminService],
  controllers: [AdminController],
})
export class AdminModule {}
