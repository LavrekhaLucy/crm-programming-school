import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OrderEntity } from '../../database/entities/order.entity';
import { UsersModule } from '../users/users.module';
import { CommentsRepository } from '../repository/services/comments.repository';
import { CommentsService } from './services/comments.service';
import { CommentsController } from './comments.controller';

@Module({
  imports: [TypeOrmModule.forFeature([OrderEntity]), UsersModule],
  providers: [CommentsService, CommentsRepository],
  controllers: [CommentsController],
  exports: [CommentsService],
})
export class CommentsModule {}
