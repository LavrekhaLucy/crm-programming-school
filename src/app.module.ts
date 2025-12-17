import { Module } from '@nestjs/common';
import { TypeormModule } from './typeorm.module';
import { ConfigModule } from '@nestjs/config';

import configuration from './configs/configuration';
import { OrdersModule } from './modules/orders/order.module';
import { UsersController } from './modules/users/users.controller';
import { AuthModule } from './modules/auth/auth.module';
import { SharedModule } from './shared/shared.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [configuration],
      isGlobal: true,
    }),
    TypeormModule,
    OrdersModule,
    AuthModule,
    SharedModule,
  ],
  controllers: [UsersController],
  // providers: [
  //   {
  //     provide: APP_FILTER,
  //     useClass: GlobalExceptionFilter,
  //   },
  // ],
})
export class AppModule {}
