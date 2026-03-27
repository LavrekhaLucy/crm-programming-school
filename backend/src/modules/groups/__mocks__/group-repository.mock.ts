import { GroupRepository } from '../../repository/services/group.repository';
import { MockServiceType } from '../../../types/mock-service.type';

export const mockRepositoryGroup: MockServiceType<Partial<GroupRepository>> = {
  create: jest.fn(),
  save: jest.fn(),
  find: jest.fn(),
  findOneBy: jest.fn(),
  findOne: jest.fn(),
};
