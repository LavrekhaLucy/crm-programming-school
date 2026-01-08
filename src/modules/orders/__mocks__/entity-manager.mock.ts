import { EntityManager, Repository } from 'typeorm';
import { TokenEntity } from '../../../database/entities/token.entity';

type FakeEntityManager = Pick<EntityManager, 'getRepository'>;

export const mockEntityManager: {
  transaction: <T>(
    runInTransaction: (manager: FakeEntityManager) => Promise<T>,
  ) => Promise<T>;
} = {
  transaction: async <T>(
    runInTransaction: (manager: FakeEntityManager) => Promise<T>,
  ): Promise<T> => {
    const fakeManager: FakeEntityManager = {
      getRepository: jest.fn().mockReturnValue({
        create: jest.fn().mockReturnValue({} as TokenEntity),
        save: jest.fn().mockResolvedValue({} as TokenEntity),
      } as Partial<Repository<TokenEntity>> as Repository<TokenEntity>),
    };
    return await runInTransaction(fakeManager);
  },
};
