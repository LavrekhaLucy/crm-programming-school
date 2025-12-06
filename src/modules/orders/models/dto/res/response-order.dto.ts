import { IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class ResponseOrderDto {
  @ApiProperty({ example: 'Alice' })
  id: number;

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
  course?: string;

  @ApiProperty({ example: 'Online' })
  course_format?: string;

  @ApiProperty({ example: 'VIP' })
  course_type?: string;

  @ApiProperty({ example: 1000 })
  sum?: number;

  @ApiProperty({ example: 1000 })
  alreadyPaid?: number;

  @IsOptional()
  utm?: string;

  @IsOptional()
  msg?: string;

  @IsOptional()
  status?: string;
}
