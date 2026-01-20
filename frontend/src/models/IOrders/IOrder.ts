import type {CoursesEnum} from "../../enums/courses.enum.ts";
import type {FormatsEnum} from "../../enums/formats.enum.ts";
import type {TypesEnum} from "../../enums/types.enum.ts";
import type {StatusesEnum} from "../../enums/statuses.enum.ts";


export interface IOrder {
  id:string;
  name: string;
  surname: string;
  email: string;
  phone: string;
  age: number;
  course: CoursesEnum;
  course_format: FormatsEnum;
  course_type: TypesEnum;
  sum: number;
  alreadyPaid?: number;
  utm?: string;
  msg?: string;
  status?: StatusesEnum;
}
