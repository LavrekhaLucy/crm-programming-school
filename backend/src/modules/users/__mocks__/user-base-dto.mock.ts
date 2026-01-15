import { UserRoleEnum } from '../../../database/entities/enums/user-role.enum';

export const mockBaseUserReqDto = {
  email: 'email',
  password: 'password',
  name: 'name',
  surname: 'surname',
  username: 'username',
  role: UserRoleEnum.MANAGER,
};
