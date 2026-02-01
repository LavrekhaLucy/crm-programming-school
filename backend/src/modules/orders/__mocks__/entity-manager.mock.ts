import { mockTokenRepository } from '../../auth/__mocks__/token-repository.mock';
import { OrderEntity } from '../../../database/entities/order.entity';
import { UserEntity } from '../../../database/entities/user.entity';
import { TokenEntity } from '../../../database/entities/token.entity';
import { mockOrderRepository } from './order-repository.mock';
import { mockUserRepository } from '../../users/__mocks__/user-repository.mock';
import { EntityManager, EntityTarget, FindOneOptions } from 'typeorm';
import { CommentEntity } from '../../../database/entities/comment.entity';
import { mockCommentsRepository } from '../../comments/__mocks__/comments-repository.mock';

type FakeRepository<T> = {
  findOne?: jest.Mock<Promise<T | null>, [FindOneOptions<T>]>;
  findOneBy?: jest.Mock<Promise<T | null>, [Partial<T>]>;
  save?: jest.Mock<Promise<T>, [T]>;
  create?: jest.Mock<T, [Partial<T>]>;
};
type FakeEntityManager = {
  getRepository: <T>(entity: EntityTarget<T>) => FakeRepository<T>;
};

export const mockEntityManager = {
  transaction: jest
    .fn()
    .mockImplementation(
      async <T>(
        ...args:
          | [(em: FakeEntityManager) => Promise<T>]
          | [string, (em: FakeEntityManager) => Promise<T>]
      ): Promise<T> => {
        const cb = typeof args[0] === 'function' ? args[0] : args[1];
        if (!cb) throw new Error('Transaction callback not provided');

        const fakeManager: FakeEntityManager = {
          getRepository: jest.fn((entity) => {
            if (entity === OrderEntity) return mockOrderRepository as unknown;
            if (entity === UserEntity) return mockUserRepository as unknown;
            if (entity === TokenEntity) return mockTokenRepository;
            if (entity === CommentEntity) return mockCommentsRepository;
            throw new Error(`No repository for given entity`);
          }),
        };

        return cb(fakeManager);
      },
    ),

  getRepository: jest.fn((entity) => {
    if (entity === OrderEntity) return mockOrderRepository;
    if (entity === UserEntity) return mockUserRepository;
    if (entity === TokenEntity) return mockTokenRepository;
    if (entity === CommentEntity) return mockCommentsRepository;
    throw new Error(`No repository for given entity`);
  }),
} as unknown as EntityManager;
