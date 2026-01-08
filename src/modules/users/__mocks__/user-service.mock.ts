import { MockServiceType } from '../../../../test/types/mock-service.type';
import { UserService } from '../services/user.service';

export const mockUserService: MockServiceType<UserService> = {
  create: jest.fn(),
  findById: jest.fn(),
  findAll: jest.fn(),
  update: jest.fn(),
  disable: jest.fn(),
  enable: jest.fn(),
  delete: jest.fn(),
};
