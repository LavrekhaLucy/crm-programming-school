import { IsString } from 'class-validator';

export class LoginReqDto {
  @IsString()
  login: string;

  @IsString()
  password: string;
}
