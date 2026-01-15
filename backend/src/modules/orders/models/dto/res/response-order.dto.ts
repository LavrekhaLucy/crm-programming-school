import { ApiProperty } from '@nestjs/swagger';
import { CoursesEnum } from '../../../../../database/entities/enums/courses.enum';
import { FormatsEnum } from '../../../../../database/entities/enums/formats.enum';
import { TypesEnum } from '../../../../../database/entities/enums/types.enum';
import { StatusesEnum } from '../../../../../database/entities/enums/statuses.enum';

export class ResponseOrderDto {
  @ApiProperty({ example: 1 })
  id: string;

  @ApiProperty({ example: 'Alice' })
  name?: string;

  @ApiProperty({ example: 'Smith' })
  surname?: string;

  @ApiProperty({ example: 'Alice@gmail.com' })
  email?: string;

  @ApiProperty({ example: '123456789' })
  phone?: string;

  @ApiProperty({ example: 25 })
  age?: number;

  @ApiProperty({ example: 'FC' })
  course?: CoursesEnum;

  @ApiProperty({ example: 'Online' })
  course_format?: FormatsEnum;

  @ApiProperty({ example: 'VIP' })
  course_type?: TypesEnum;

  @ApiProperty({ example: 1000 })
  sum?: number;

  @ApiProperty({ example: 1000 })
  alreadyPaid?: number;

  @ApiProperty({ example: 'facebook', nullable: true })
  utm?: string;

  @ApiProperty({ example: 'Call after 6PM', nullable: true })
  msg?: string;

  @ApiProperty({ example: 'NEW', nullable: true })
  status?: StatusesEnum;
}
