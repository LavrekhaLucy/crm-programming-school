import { mockTokenRepository } from '../../auth/__mocks__/token-repository.mock';
import { OrderEntity } from '../../../database/entities/order.entity';
import { UserEntity } from '../../../database/entities/user.entity';
import { TokenEntity } from '../../../database/entities/token.entity';
import { mockOrderRepository } from './order-repository.mock';
import { mockUserRepository } from '../../users/__mocks__/user-repository.mock';
import { FindOneOptions } from 'typeorm';

type FakeRepository<T> = {
  findOne?: jest.Mock<Promise<T | null>, [FindOneOptions<T>]>;
  findOneBy?: jest.Mock<Promise<T | null>, [Partial<T>]>;
  save?: jest.Mock<Promise<T>, [T]>;
};
type FakeEntityManager = {
  getRepository: <T>(entity: new () => T) => FakeRepository<T>;
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
            throw new Error(`No repository for ${entity?.name}`);
          }),
        };

        return cb(fakeManager);
      },
    ),
};
