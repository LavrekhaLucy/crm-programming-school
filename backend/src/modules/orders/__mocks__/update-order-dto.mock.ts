import { CoursesEnum } from '../../../database/entities/enums/courses.enum';
import { FormatsEnum } from '../../../database/entities/enums/formats.enum';
import { TypesEnum } from '../../../database/entities/enums/types.enum';
import { StatusesEnum } from '../../../database/entities/enums/statuses.enum';
import { OrderEntity } from '../../../database/entities/order.entity';

export const mockUpdateOrderDto = {
  id: 'orderId',
  name: 'name',
  surname: 'surname',
  email: 'email',
  phone: 'phone',
  age: 30,
  course: CoursesEnum.FS,
  course_format: FormatsEnum.ONLINE,
  course_type: TypesEnum.VIP,
  sum: 1000,
  alreadyPaid: 1000,
  utm: 'utm',
  msg: 'msg',
  status: StatusesEnum.NEW,
} as OrderEntity;
