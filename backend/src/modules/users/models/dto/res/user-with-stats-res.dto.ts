import { ApiProperty } from '@nestjs/swagger';
import { UserBaseResDto } from './user-base.res.dto';

export class ManagerPerformanceDto {
  @ApiProperty() total: number;
  @ApiProperty() new: number;
  @ApiProperty() agree: number;
  @ApiProperty() in_work: number;
  @ApiProperty() disagree: number;
  @ApiProperty() dubbing: number;
}

export class UserWithStatsResDto extends UserBaseResDto {
  @ApiProperty({ type: ManagerPerformanceDto })
  stats: ManagerPerformanceDto;
}
