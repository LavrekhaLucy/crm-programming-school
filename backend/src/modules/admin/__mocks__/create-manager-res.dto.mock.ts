import { UserRoleEnum } from '../../../database/entities/enums/user-role.enum';

export const mockCreateManagerResDto = {
  id: 1,
  email: 'email',
  name: 'name',
  surname: 'surname',
  username: 'username',
  role: UserRoleEnum.MANAGER,
};
