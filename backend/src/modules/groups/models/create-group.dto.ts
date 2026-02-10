import { ApiProperty } from '@nestjs/swagger';
import { Length } from 'class-validator';
import { Transform } from 'class-transformer';
import { TransformHelper } from '../../../common/helpers/transform.helper';

export class CreateGroupDto {
  @ApiProperty({ example: 'VIP' })
  @Length(3, 50)
  @Transform(TransformHelper.trim)
  name: string;
}
