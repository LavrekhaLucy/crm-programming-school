import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from '../../database/entities/user.entity';
import { UserService } from './services/user.service';
import { UsersController } from './users.controller';
import { AdminController } from './admin.controller';

@Module({
  imports: [TypeOrmModule.forFeature([UserEntity])],
  providers: [UserService],
  controllers: [UsersController, AdminController],
})
export class UsersModule {}
