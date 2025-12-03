import { Module } from '@nestjs/common';
import { TypeormModule } from './typeorm.module';
import { ConfigModule } from '@nestjs/config';

import configuration from './configs/configuration';
import { OrdersModule } from './modules/orders/order.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [configuration],
      isGlobal: true,
    }),
    TypeormModule,
    OrdersModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
