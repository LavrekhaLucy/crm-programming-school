import { EntityManager } from 'typeorm';
import { mockTokenRepository } from '../../auth/__mocks__/token-repository.mock';

type FakeEntityManager = Pick<EntityManager, 'getRepository'>;

export const mockEntityManager = {
  transaction: jest
    .fn()
    .mockImplementation(
      async <T>(
        runInTransaction: (manager: FakeEntityManager) => Promise<T>,
      ): Promise<T> => {
        const fakeManager: FakeEntityManager = {
          getRepository: jest.fn().mockReturnValue(mockTokenRepository),
        };
        return await runInTransaction(fakeManager);
      },
    ),
};
