import { IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class LoginReqDto {
  @ApiProperty({ example: 'user@example.com' })
  @IsNotEmpty({ message: 'Invalid email or password' })
  @IsString()
  login: string;

  @ApiProperty({ example: '123qwe!@#QWE' })
  @IsNotEmpty({ message: 'Invalid email or password' })
  @IsString()
  password: string;
}
