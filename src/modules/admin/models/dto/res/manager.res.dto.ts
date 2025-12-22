import { IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class ManagerResDto {
  @ApiProperty({ example: 'test@gmail.com' })
  email: string;

  @ApiProperty({ example: '123qwe!@#QWE' })
  password: string;

  @IsString()
  username: string;

  @IsString()
  name?: string;

  @IsString()
  surname?: string;
}
