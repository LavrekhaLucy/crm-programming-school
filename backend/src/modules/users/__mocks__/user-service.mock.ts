import { UserService } from '../services/user.service';
import { MockServiceType } from '../../../types/mock-service.type';

export const mockUserService: MockServiceType<UserService> = {
  create: jest.fn(),
  findById: jest.fn(),
  findAll: jest.fn(),
  update: jest.fn(),
  disable: jest.fn(),
  enable: jest.fn(),
  delete: jest.fn(),
};
