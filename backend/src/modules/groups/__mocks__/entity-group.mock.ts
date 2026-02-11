import { GroupEntity } from '../../../database/entities/group.entity';
import { CreateGroupDto } from '../models/create-group.dto';

const dto: CreateGroupDto = { name: 'VIP' };

export const mockEntityGroup: GroupEntity = {
  id: 1,
  name: dto.name,
  orders: [],
};
