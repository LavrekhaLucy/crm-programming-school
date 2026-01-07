import { UserMapper } from '../user.mapper';
import { mockUserEntity } from './user-entity.mock';

export const mockUserResDto = UserMapper.toResDto(mockUserEntity);
