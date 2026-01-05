import { UserMapper } from '../user.mapper';
import { mockUserEntity } from './user-entity.mock';

// export const mockUserResDto = {
//   id: 'id',
//   name: 'name',
//   email: 'email',
//   avatarUrl: 'avatarUrl',
//   locale: 'locale',
//   role: UserRoleEnum.MANAGER,
//   isAdultAccepted: true,
// };
export const mockUserResDto = UserMapper.toResDto(mockUserEntity);
