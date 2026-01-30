import { Body, Controller, Param, Post, UseGuards } from '@nestjs/common';
import { CreateCommentDto } from './models/create-comment.dto';
import { UserEntity } from '../../database/entities/user.entity';
import { CurrentUser } from '../../common/decorators/user.decorator';
import { AuthGuard } from '@nestjs/passport';
import { CommentsService } from './comments.service';

@Controller('orders')
@UseGuards(AuthGuard)
export class CommentsController {
  constructor(private readonly commentsService: CommentsService) {}

  @Post(':orderId/comments')
  addComment(
    @Param('orderId') orderId: string,
    @CurrentUser() user: UserEntity,
    @Body() dto: CreateCommentDto,
  ) {
    return this.commentsService.addCommentToOrder(orderId, user, dto);
  }
}
