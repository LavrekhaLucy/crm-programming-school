import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import {
  IsOptional,
  IsString,
  Length,
  Matches,
  IsEnum,
  IsBoolean,
} from 'class-validator';
import { TransformHelper } from '../../../../../common/helpers/transform.helper';
import { UserRoleEnum } from '../../../../../database/entities/enums/user-role.enum';

export class BaseUserReqDto {
  @IsString()
  @Length(3, 50)
  @Transform(TransformHelper.trim)
  name: string;

  @IsString()
  @Length(3, 50)
  @Transform(TransformHelper.trim)
  surname: string;

  @IsString()
  @Length(3, 50)
  @Transform(TransformHelper.trim)
  username: string;

  @ApiProperty({ example: 'test@gmail.com' })
  @IsString()
  @Length(5, 300)
  @Matches(/^[^\s@]+@([^\s@.,]+\.)+[^\s@.,]{2,}$/)
  @Transform(TransformHelper.trim)
  email: string;

  @ApiProperty({ example: '123qwe!@#QWE' })
  @IsString()
  @Length(8, 300)
  @Matches(/^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%_*#?&]).{8,}$/)
  password: string;

  @ApiProperty({ example: 'manager' })
  @IsEnum(UserRoleEnum)
  role: UserRoleEnum;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  avatarUrl?: string | null;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  locale?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsBoolean()
  isAdultAccepted?: boolean;
}
