export interface IOrder {
  name: string;
  surname: string;
  email: string;
  phone: string;
  age: number;
  course: string;
  course_format: string;
  course_type: string;
  sum: number;
  alreadyPaid?: number;
  utm?: string;
  msg?: string;
  status?: string;
}
