import {
  IsEmail,
  IsOptional,
  IsString,
  Length,
  Matches,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { TransformHelper } from '../../../../common/helpers/transform.helper';

export class RegisterReqDto {
  @ApiProperty({ example: 'john_doe' })
  @IsOptional()
  @IsString()
  @Length(3, 25)
  username: string;

  @ApiProperty({ example: 'johnDoe@gmail.com' })
  @IsEmail()
  @IsString()
  email: string;

  @ApiProperty({ example: 'John' })
  @IsOptional()
  @IsString()
  @Length(3, 50)
  @Transform(TransformHelper.trim)
  name: string;

  @ApiProperty({ example: 'Doe' })
  @IsOptional()
  @IsString()
  @Length(3, 50)
  @Transform(TransformHelper.trim)
  surname: string;

  @ApiProperty({ example: '123qwe!@#QWE' })
  @IsString()
  @Length(8, 300)
  @Matches(/^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%_*#?&]).*$/, {
    message:
      'Password must contain at least one letter, one number and one special character',
  })
  password: string;
}
