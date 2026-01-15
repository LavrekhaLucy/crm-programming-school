import { UserRoleEnum } from '../../../../../database/entities/enums/user-role.enum';
import { ApiProperty } from '@nestjs/swagger';

export class UserBaseResDto {
  @ApiProperty({ example: 1 })
  id: number;

  @ApiProperty({ example: 'Alice@gmail.com' })
  email: string;

  @ApiProperty({ example: 'admin' })
  role: UserRoleEnum;

  @ApiProperty({ example: 'Alice' })
  name: string;

  @ApiProperty()
  avatarUrl: string | null;

  @ApiProperty()
  locale: string;

  @ApiProperty()
  isAdultAccepted: boolean;
}
