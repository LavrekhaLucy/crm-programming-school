import { CoursesEnum } from 'src/database/entities/enums/courses.enum';
import { UpdateOrderDto } from '../models/dto/req/update-order.dto';
import { FormatsEnum } from '../../../database/entities/enums/formats.enum';
import { TypesEnum } from '../../../database/entities/enums/types.enum';
import { StatusesEnum } from '../../../database/entities/enums/statuses.enum';

export const updateDto: UpdateOrderDto = {
  name: 'New Name',
  surname: 'New Surname',
  email: 'test@mail.com',
  phone: '380000000000',
  age: 25,
  course: CoursesEnum.FS,
  course_format: FormatsEnum.ONLINE,
  course_type: TypesEnum.VIP,
  status: StatusesEnum.INWORK,
  sum: 1000,
  alreadyPaid: 500,
  group: 1,
  manager: 1,
};
