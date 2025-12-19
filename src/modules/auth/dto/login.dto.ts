import { IsEmail, IsOptional, IsString } from 'class-validator';

export class LoginDto {
  @IsString()
  readonly password: string;

  @IsOptional()
  @IsString()
  readonly username?: string;

  @IsOptional()
  @IsEmail()
  readonly email?: string;
}
