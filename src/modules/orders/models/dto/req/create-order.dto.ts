import {
  IsString,
  IsInt,
  IsOptional,
  IsEmail,
  Length,
  Min,
} from 'class-validator';
import { Transform } from 'class-transformer';
import { TransformHelper } from '../../../../../common/helpers/transform.helper';
import { ApiProperty } from '@nestjs/swagger';
import { CoursesEnum } from '../../../../../database/entities/enums/courses.enum';
import { FormatsEnum } from '../../../../../database/entities/enums/formats.enum';
import { TypesEnum } from '../../../../../database/entities/enums/types.enum';
import { StatusesEnum } from '../../../../../database/entities/enums/statuses.enum';

export class CreateOrderDto {
  @ApiProperty({ example: 'Alice' })
  @IsString()
  @Length(1, 25)
  @Transform(TransformHelper.trim)
  name: string;

  @ApiProperty({ example: 'Smith' })
  @IsString()
  @Length(1, 25)
  @Transform(TransformHelper.trim)
  surname: string;

  @ApiProperty({ example: 'Alice@gmail.com' })
  @IsEmail()
  @Length(1, 100)
  @Transform(TransformHelper.trim)
  email: string;

  @ApiProperty({ example: '123456789' })
  @IsString()
  @Length(1, 12)
  @Transform(TransformHelper.trim)
  phone: string;

  @ApiProperty({ example: 25 })
  @IsInt()
  @Min(0)
  age: number;

  @ApiProperty({ example: 'FC' })
  // @IsString()
  @Length(1, 10)
  @Transform(TransformHelper.trim)
  course: CoursesEnum;

  @ApiProperty({ example: 'Online' })
  // @IsString()
  @Length(1, 15)
  @Transform(TransformHelper.trim)
  course_format: FormatsEnum;

  @ApiProperty({ example: 'VIP' })
  // @IsString()
  @Length(1, 100)
  @Transform(TransformHelper.trim)
  course_type: TypesEnum;

  @ApiProperty({ example: 1000 })
  @IsInt()
  sum: number;

  @ApiProperty({ example: 1000 })
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
  status?: StatusesEnum;
}
