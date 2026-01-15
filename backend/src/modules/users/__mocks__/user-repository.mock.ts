import { MockServiceType } from '../../../../test/types/mock-service.type';
import { UserRepository } from '../../repository/services/user.repository';
import { mockQueryBuilder } from '../../orders/__mocks__/query-builder.mock';
import { UserEntity } from '../../../database/entities/user.entity';

export const userQB = mockQueryBuilder<UserEntity>();

export const mockUserRepository: MockServiceType<Partial<UserRepository>> = {
  create: jest.fn(),
  save: jest.fn(),
  find: jest.fn(),
  findOne: jest.fn(),
  findOneBy: jest.fn(),
  update: jest.fn(),
  delete: jest.fn(),
  createQueryBuilder: jest.fn().mockReturnValue(userQB),
};
