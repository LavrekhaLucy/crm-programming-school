import { UserRoleEnum } from '../../../database/entities/enums/user-role.enum';

export const mockBaseUserReqDto = {
  id: 'id',
  name: 'name',
  email: 'email',
  avatarUrl: 'avatarUrl',
  locale: 'locale',
  role: UserRoleEnum.MANAGER,
  isAdultAccepted: true,
};
