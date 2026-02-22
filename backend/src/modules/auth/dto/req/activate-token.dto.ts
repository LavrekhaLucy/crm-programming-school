import { IsNotEmpty, IsString, MinLength } from 'class-validator';

export class ActivateDto {
  @IsString()
  @IsNotEmpty()
  token: string;

  @IsString()
  @MinLength(8, { message: 'Password must be at least 8 characters long' })
  password: string;
}
