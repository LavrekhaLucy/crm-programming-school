import { UserRoleEnum } from '../../../database/entities/enums/user-role.enum';
import { UserResDto } from '../models/dto/res/user.res.dto';

export const mockAdminUser = { id: 10, role: UserRoleEnum.ADMIN } as UserResDto;
