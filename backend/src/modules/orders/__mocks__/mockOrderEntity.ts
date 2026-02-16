import { OrderEntity } from '../../../database/entities/order.entity';
import { CoursesEnum } from '../../../database/entities/enums/courses.enum';
import { FormatsEnum } from '../../../database/entities/enums/formats.enum';
import { TypesEnum } from '../../../database/entities/enums/types.enum';
import { StatusesEnum } from '../../../database/entities/enums/statuses.enum';

export const mockOrderEntity: OrderEntity = {
  id: '1',
  name: 'name',
  surname: 'surname',
  email: 'email',
  phone: 'phone',
  age: 30,
  course: CoursesEnum.FS,
  course_format: FormatsEnum.ONLINE,
  course_type: TypesEnum.VIP,
  created_at: new Date(),
  status: StatusesEnum.NEW,
  sum: 1000,
  alreadyPaid: 1000,
  utm: 'utm',
  msg: 'msg',
  manager: null,
  group: null,
  comments: [],
};
export const mockOrderEntities: OrderEntity[] = [mockOrderEntity];
