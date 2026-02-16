import { OrderSortField } from '../../../database/entities/enums/order-sort-field.enum';
import { SortOrder } from '../../../database/entities/enums/sort-order.enum';
import { BadRequestException } from '@nestjs/common';
import { parseOrder } from '../utils/order-query.util';

describe('parseOrder', () => {
  it('should return default sort when order is undefined', () => {
    const result = parseOrder();
    expect(result).toEqual({
      sortBy: OrderSortField.CREATED_AT,
      sortOrder: SortOrder.DESC,
    });
  });

  it('should return DESC order when field starts with "-"', () => {
    const result = parseOrder(`-${OrderSortField.ID}`);
    expect(result).toEqual({
      sortBy: OrderSortField.ID,
      sortOrder: SortOrder.DESC,
    });
  });

  it('should return ASC order when field does not start with "-"', () => {
    const result = parseOrder(OrderSortField.ID);
    expect(result).toEqual({
      sortBy: OrderSortField.ID,
      sortOrder: SortOrder.ASC,
    });
  });

  it('should throw BadRequestException when field is invalid', () => {
    expect(() => parseOrder('invalid_field')).toThrow(BadRequestException);
    expect(() => parseOrder('-invalid_field')).toThrow(BadRequestException);
  });
});
