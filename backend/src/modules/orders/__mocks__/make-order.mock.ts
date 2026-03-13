import { OrderEntity } from '../../../database/entities/order.entity';

export const makeOrder = (overrides: Partial<OrderEntity> = {}): OrderEntity =>
  ({
    id: '1',
    manager: null,
    group: null,
    ...overrides,
  }) as OrderEntity;
