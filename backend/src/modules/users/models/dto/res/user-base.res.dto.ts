import { UserRoleEnum } from '../../../../../database/entities/enums/user-role.enum';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class UserBaseResDto {
  @ApiProperty({ example: 1 })
  id: number;

  @ApiProperty({ example: 'Alice@gmail.com' })
  email: string;

  @ApiProperty({ example: 'admin' })
  role: UserRoleEnum;

  @ApiProperty({ example: 'Alice' })
  name: string;

  @ApiProperty({ example: 'Armstrong' })
  surname: string;

  @ApiProperty()
  avatarUrl: string | null;

  @ApiProperty()
  locale: string;

  @ApiProperty()
  isAdultAccepted: boolean;

  @ApiProperty()
  isActive: boolean;

  @ApiProperty()
  lastLogin: Date | null;

  @ApiPropertyOptional({ example: 12 })
  total_orders?: number;
}
