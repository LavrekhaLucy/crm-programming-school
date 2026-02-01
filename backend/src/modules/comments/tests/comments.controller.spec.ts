import { CommentsController } from '../comments.controller';
import { Test } from '@nestjs/testing';
import { usersModuleProviders } from '../../users/__mocks__/users-module.mock';
import { mockUserEntity } from '../../users/__mocks__/user-entity.mock';
import { mockCommentsService } from '../__mocks__/comments-service.mock';
import { mockComment, mockComments } from '../__mocks__/comment.mock';

describe('Comments Controller', () => {
  let commentsController: CommentsController;

  const mockCreateCommentDto = {
    text: 'text',
  };

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      controllers: [CommentsController],
      providers: [...usersModuleProviders],
    }).compile();

    commentsController = module.get<CommentsController>(CommentsController);
  });
  afterEach(() => {
    jest.clearAllMocks();
  });
  it('should be defined', () => {
    expect(commentsController).toBeDefined();
  });

  describe('addCommentToOrder', () => {
    it('should call service method with correct parameters', async () => {
      const orderId = '1';

      mockCommentsService.addCommentToOrder.mockResolvedValue(mockComment);

      const result = await commentsController.addCommentToOrder(
        orderId,
        mockUserEntity,
        mockCreateCommentDto,
      );

      expect(mockCommentsService.addCommentToOrder).toHaveBeenCalledWith(
        orderId,
        mockUserEntity,
        mockCreateCommentDto,
      );

      expect(result).toEqual(mockComment);
    });
  });

  describe('getCommentsByOrder', () => {
    it('should call service method with correct orderId', async () => {
      const orderId = '1';

      mockCommentsService.getCommentsByOrder.mockResolvedValue(mockComments);

      const result = await commentsController.getCommentsByOrder(orderId);

      expect(mockCommentsService.getCommentsByOrder).toHaveBeenCalledWith(
        orderId,
      );
      expect(result).toEqual(mockComments);
    });
  });
});
