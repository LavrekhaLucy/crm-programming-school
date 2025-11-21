import { Module } from '@nestjs/common';
import { TypeormModule } from './typeorm.module';

@Module({
  imports: [TypeormModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
