import { CommentsService } from '../services/comments.service';
import { MockServiceType } from '../../../../test/types/mock-service.type';

export const mockCommentsService: MockServiceType<CommentsService> = {
  addCommentToOrder: jest.fn(),
  getCommentsByOrder: jest.fn(),
};
