import { UserResDto } from '../../users/models/dto/res/user.res.dto';
import { UserRoleEnum } from '../../../database/entities/enums/user-role.enum';

export const mockExpectedResult: UserResDto = {
  id: 1,
  name: 'John',
  role: UserRoleEnum.ADMIN,
  email: 'a@a.com',
  avatarUrl: null,
  locale: 'en',
  isAdultAccepted: true,
};
