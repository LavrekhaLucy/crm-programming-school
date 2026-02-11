import { MockServiceType } from '../../../../test/types/mock-service.type';
import { GroupRepository } from '../../repository/services/group.repository';

export const mockRepositoryGroup: MockServiceType<Partial<GroupRepository>> = {
  create: jest.fn(),
  save: jest.fn(),
  find: jest.fn(),
  findOne: jest.fn(),
};
