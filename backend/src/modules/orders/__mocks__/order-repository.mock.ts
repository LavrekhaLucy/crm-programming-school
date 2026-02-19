import { MockServiceType } from '../../../../test/types/mock-service.type';
import { OrdersRepository } from '../../repository/services/orders.repository';

export const mockOrderRepository: MockServiceType<Partial<OrdersRepository>> = {
  create: jest.fn(),
  save: jest.fn(),
  find: jest.fn(),
  findOne: jest.fn(),
  findOneBy: jest.fn(),
  update: jest.fn(),
  delete: jest.fn(),
  createQueryBuilder: jest.fn(),
  findAndCount: jest.fn(),
  count: jest.fn(),
};
