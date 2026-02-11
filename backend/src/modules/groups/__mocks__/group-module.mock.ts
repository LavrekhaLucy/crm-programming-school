import { Provider } from '@nestjs/common';
import { GroupService } from '../services/group.service';
import { GroupRepository } from '../../repository/services/group.repository';
import { mockRepositoryGroup } from './group-repository.mock';
import { mockServiceGroup } from './group-service.mock';

export const groupsModuleProviders: Provider[] = [
  {
    provide: GroupService,
    useValue: mockServiceGroup,
  },
  {
    provide: GroupRepository,
    useValue: mockRepositoryGroup,
  },
];
