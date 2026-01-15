import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from '../../database/entities/user.entity';
import { UserService } from './services/user.service';
import { UsersController } from './users.controller';
import { UserRepository } from '../repository/services/user.repository';

@Module({
  imports: [TypeOrmModule.forFeature([UserEntity])],
  providers: [UserService, UserRepository],
  controllers: [UsersController],
  exports: [UserService, TypeOrmModule, UserRepository],
})
export class UsersModule {}
