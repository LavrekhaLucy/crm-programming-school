import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from '../../database/entities/user.entity';
import { AdminService } from './services/admin.service';

@Module({
  imports: [TypeOrmModule.forFeature([UserEntity])],
  providers: [AdminService],
})
export class UsersModule {}
