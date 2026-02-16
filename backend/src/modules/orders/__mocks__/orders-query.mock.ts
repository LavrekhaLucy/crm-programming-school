import { OrdersQueryDto } from '../models/dto/req/orders-query.dto';

export const mockOrdersQuery: OrdersQueryDto = {
  name: 'John',
  surname: 'Smith',
  email: 'test@mail.com',
  phone: '1234567890',
  age: '30',
  startDate: '2026-01-01',
  endDate: '2026-01-31',
  course: 'TS',
  course_format: 'online',
  course_type: 'minimal',
  status: 'new',
  group: 'group1',
  page: '1',
  limit: '25',
};
