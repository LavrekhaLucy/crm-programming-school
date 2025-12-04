import { PickType } from '@nestjs/swagger';

import { UserBaseResDto } from './user-base.res.dto';

export class UserResDto extends PickType(UserBaseResDto, [
  'id',
  'email',
  'password',
  'role',
  'name',
  'avatarUrl',
  'isVerified',
  'locale',
  'isAdultAccepted',
]) {}
