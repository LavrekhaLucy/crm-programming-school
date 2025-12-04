import { UserRoleEnum } from '../../../../../database/entities/enums/user-role.enum';

export class UserBaseResDto {
  id: number;
  email: string;
  password: string;
  role: UserRoleEnum;
  name: string;
  avatarUrl: string | null;
  isVerified: boolean;
  locale: string;
  isAdultAccepted: boolean;
}
