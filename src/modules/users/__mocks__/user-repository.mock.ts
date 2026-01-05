import { MockServiceType } from '../../../../test/types/mock-service.type';
import { UserRepository } from '../../repository/services/user.repository';

export const mockUserRepository: MockServiceType<Partial<UserRepository>> = {
  create: jest.fn(),
  save: jest.fn(),
  find: jest.fn(),
  findOne: jest.fn(),
  findOneBy: jest.fn(),
  update: jest.fn(),
  delete: jest.fn(),
};
