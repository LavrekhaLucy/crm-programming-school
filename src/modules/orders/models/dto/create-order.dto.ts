import {
  IsString,
  IsInt,
  IsOptional,
  IsEmail,
  Length,
  Min,
} from 'class-validator';
import { Transform } from 'class-transformer';
import { TransformHelper } from '../../../../common/helpers/transform.helper';

export class CreateOrderDto {
  @IsString()
  @Length(1, 25)
  @Transform(TransformHelper.trim)
  name: string;

  @IsString()
  @Length(1, 25)
  @Transform(TransformHelper.trim)
  surname: string;

  @IsEmail()
  @Length(1, 100)
  @Transform(TransformHelper.trim)
  email: string;

  @IsString()
  @Length(1, 12)
  @Transform(TransformHelper.trim)
  phone: string;

  @IsInt()
  @Min(0)
  age: number;

  @IsString()
  @Length(1, 10)
  @Transform(TransformHelper.trim)
  course: string;

  @IsString()
  @Length(1, 15)
  @Transform(TransformHelper.trim)
  course_format: string;

  @IsString()
  @Length(1, 100)
  @Transform(TransformHelper.trim)
  course_type: string;

  @IsInt()
  sum: number;

  @IsOptional()
  @IsInt()
  alreadyPaid?: number;

  @IsOptional()
  @IsString()
  @Length(0, 100)
  @Transform(TransformHelper.trim)
  utm?: string;

  @IsOptional()
  @IsString()
  @Length(0, 100)
  @Transform(TransformHelper.trim)
  msg?: string;

  @IsOptional()
  @IsString()
  @Length(0, 15)
  status?: string;
}
