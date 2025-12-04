import { Module } from '@nestjs/common';
import { TypeormModule } from './typeorm.module';
import { ConfigModule } from '@nestjs/config';

import configuration from './configs/configuration';
import { OrdersModule } from './modules/orders/order.module';
import { UserService } from './modules/users/services/user/user.service';
import { UsersController } from './modules/users/users.controller';
import { UsersModule } from './modules/users/users.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [configuration],
      isGlobal: true,
    }),
    TypeormModule,
    OrdersModule,
    UsersModule,
  ],
  controllers: [UsersController],
  providers: [UserService],
})
export class AppModule {}
