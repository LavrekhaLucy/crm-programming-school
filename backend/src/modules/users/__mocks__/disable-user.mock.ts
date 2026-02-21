import { mockUserResDto } from './user-res-dto.mock';

export const mockDisabledUserResDto = {
  ...mockUserResDto,
  isActive: false,
};
