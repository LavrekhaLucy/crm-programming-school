import { CommentsController } from '../comments.controller';
import { Test } from '@nestjs/testing';
import { UsersController } from '../../users/users.controller';
import { usersModuleProviders } from '../../users/__mocks__/users-module.mock';

describe('Comments Controller', () => {
  let commentsController: CommentsController;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      controllers: [UsersController],
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
    it('should call service method with correct parameters', async () => {});
  });

  describe('getCommentsByOrder', () => {
    it('should call service method with correct orderId', async () => {});
  });
});
