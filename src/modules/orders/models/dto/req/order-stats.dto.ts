import { StatusesEnum } from '../../../../../database/entities/enums/statuses.enum';

export class OrdersStatsDto {
  status: StatusesEnum | string;
  count: number;
}
