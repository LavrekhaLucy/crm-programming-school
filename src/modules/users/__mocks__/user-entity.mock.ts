import { UserEntity } from '../../../database/entities/user.entity';
import { UserRoleEnum } from '../../../database/entities/enums/user-role.enum';

export const mockUserEntity: UserEntity = {
  id: 1,
  email: 'email',
  password: 'password',
  name: 'name',
  surname: 'surname',
  username: 'username',
  role: UserRoleEnum.MANAGER,
  avatarUrl: null,
  isActive: true,
  locale: 'en',
  isAdultAccepted: true,
  created_at: new Date('2024-01-01'),
  updated_at: new Date('2024-01-01'),
} as UserEntity;
