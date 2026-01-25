import {
  IsOptional,
  IsEnum,
  IsString,
  IsNumberString,
  IsBooleanString,
} from 'class-validator';
import { OrderSortField } from '../../../../../database/entities/enums/order-sort-field.enum';
import { SortOrder } from '../../../../../database/entities/enums/sort-order.enum';

export class OrdersQueryDto {
  // pagination
  @IsOptional()
  @IsNumberString()
  page?: string;

  @IsOptional()
  @IsNumberString()
  limit?: string;

  // sorting
  @IsOptional()
  @IsEnum(OrderSortField)
  sortBy?: OrderSortField;

  @IsOptional()
  @IsEnum(SortOrder)
  sortOrder?: SortOrder;

  // text filters
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsString()
  surname?: string;

  @IsOptional()
  @IsString()
  email?: string;

  @IsOptional()
  @IsString()
  phone?: string;

  @IsOptional()
  @IsString()
  startDate?: string;

  @IsOptional()
  @IsString()
  endDate?: string;

  // dropdown filters
  @IsOptional()
  @IsString()
  course?: string;

  @IsOptional()
  @IsString()
  course_format?: string;

  @IsOptional()
  @IsString()
  course_type?: string;

  @IsOptional()
  @IsString()
  status?: string;

  @IsOptional()
  @IsString()
  group?: string;

  // checkbox
  @IsOptional()
  @IsBooleanString()
  onlyMine?: string;
}
