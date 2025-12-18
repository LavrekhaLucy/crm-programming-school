import { UserRoleEnum } from '../../../../../database/entities/enums/user-role.enum';
import { ApiProperty } from '@nestjs/swagger';

export class UserBaseResDto {
  @ApiProperty()
  id: number;

  @ApiProperty()
  email: string;

  @ApiProperty()
  password: string;

  @ApiProperty()
  role: UserRoleEnum;

  @ApiProperty()
  name: string;

  @ApiProperty()
  avatarUrl: string | null;

  @ApiProperty()
  isVerified: boolean;

  @ApiProperty()
  locale: string;

  @ApiProperty()
  isAdultAccepted: boolean;
}
