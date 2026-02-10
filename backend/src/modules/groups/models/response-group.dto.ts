import { ApiProperty } from '@nestjs/swagger';

export class ResponseGroupDto {
  @ApiProperty({ example: 1 })
  id: number;

  @ApiProperty({ example: 'VIP' })
  name: string;
}
