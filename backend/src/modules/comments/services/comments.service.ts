import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { EntityManager } from 'typeorm';
import { InjectEntityManager } from '@nestjs/typeorm';
import { UserEntity } from '../../../database/entities/user.entity';
import { CreateCommentDto } from '../models/create-comment.dto';
import { CommentEntity } from '../../../database/entities/comment.entity';
import { OrderEntity } from '../../../database/entities/order.entity';
import { StatusesEnum } from '../../../database/entities/enums/statuses.enum';

@Injectable()
export class CommentsService {
  constructor(
    @InjectEntityManager()
    private readonly entityManager: EntityManager,
  ) {}

  async addCommentToOrder(
    orderId: string,
    user: UserEntity,
    dto: CreateCommentDto,
  ): Promise<CommentEntity> {
    return this.entityManager.transaction(async (em) => {
      const orderRepository = em.getRepository(OrderEntity);
      const commentRepository = em.getRepository(CommentEntity);

      const order = await orderRepository.findOne({
        where: { id: orderId },
        relations: ['manager'],
      });

      if (!order) {
        throw new NotFoundException('Order not found');
      }
      if (order.manager && order.manager.id !== user.id) {
        throw new ForbiddenException('You cannot comment on this order');
      }
      if (!order.manager) {
        order.manager = user;
      }
      if (!order.status || order.status === StatusesEnum.NEW) {
        order.status = StatusesEnum.INWORK;
      }
      const comment = commentRepository.create({
        text: dto.text,
        order,
        user,
      });
      await orderRepository.save(order);
      return await commentRepository.save(comment);
    });
  }

  async getCommentsByOrder(orderId: string): Promise<CommentEntity[]> {
    return this.entityManager.getRepository(CommentEntity).find({
      where: { order: { id: orderId } },
      relations: ['user'],
      order: { created_at: 'ASC' },
    });
  }
}
