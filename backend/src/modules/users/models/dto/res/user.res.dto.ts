import { PickType } from '@nestjs/swagger';

import { UserBaseResDto } from './user-base.res.dto';

export class UserResDto extends PickType(UserBaseResDto, [
  'id',
  'email',
  'role',
  'name',
  'avatarUrl',
  'locale',
  'isAdultAccepted',
]) {}
