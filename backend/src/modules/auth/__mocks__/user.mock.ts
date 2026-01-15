import { UserEntity } from '../../../database/entities/user.entity';
import { UserRoleEnum } from '../../../database/entities/enums/user-role.enum';

export const validatePasswordMock = jest.fn();

export const mockUser: Partial<UserEntity> = {
  id: 1,
  username: 'test',
  password: 'hashedPassword',
  role: UserRoleEnum.MANAGER,
  validatePassword: validatePasswordMock,
};
