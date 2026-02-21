import { PickType } from '@nestjs/swagger';

import { UserBaseResDto } from './user-base.res.dto';

export class UserResDto extends PickType(UserBaseResDto, [
  'id',
  'email',
  'role',
  'name',
  'surname',
  'avatarUrl',
  'locale',
  'isAdultAccepted',
  'isActive',
  'lastLogin',
  'total_orders',
]) {}
