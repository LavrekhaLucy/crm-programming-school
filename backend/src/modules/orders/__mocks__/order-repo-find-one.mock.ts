import { CoursesEnum } from '../../../database/entities/enums/courses.enum';
import { FormatsEnum } from '../../../database/entities/enums/formats.enum';
import { TypesEnum } from '../../../database/entities/enums/types.enum';
import { StatusesEnum } from '../../../database/entities/enums/statuses.enum';
import { OrderEntity } from '../../../database/entities/order.entity';

export const mockOrderRepoFindOne = {
  id: 'order1',
  manager: null,
  name: 'John',
  surname: 'Doe',
  email: 'john@example.com',
  phone: '123456',
  age: 30,
  course: CoursesEnum.FS,
  course_format: FormatsEnum.ONLINE,
  course_type: TypesEnum.VIP,
  sum: 1000,
  alreadyPaid: 0,
  utm: '',
  msg: '',
  status: StatusesEnum.NEW,
  group: null,
  comments: [],
  created_at: new Date(),
  updated_at: new Date(),
} as unknown as OrderEntity;
