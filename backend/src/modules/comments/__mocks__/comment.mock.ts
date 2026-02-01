import { mockUser } from '../../auth/__mocks__/user.mock';
import { mockOrderEntity } from '../../orders/__mocks__/mockOrderEntity';
import { CommentEntity } from '../../../database/entities/comment.entity';

export const mockComment = {
  id: 1,
  text: 'hello',
  user: mockUser,
  order: mockOrderEntity,
} as CommentEntity;
export const mockComments: CommentEntity[] = [mockComment];
