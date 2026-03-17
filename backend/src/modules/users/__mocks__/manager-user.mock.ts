import { UserRoleEnum } from '../../../database/entities/enums/user-role.enum';
import { UserResDto } from '../models/dto/res/user.res.dto';

export const mockManagerUser = {
  id: 11,
  role: UserRoleEnum.MANAGER,
} as UserResDto;
