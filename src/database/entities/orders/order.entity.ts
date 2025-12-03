import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';
import { CreateUpdateModel } from '../models/create-update.model';
import { TableNameEnum } from '../enums/table-name.enum';

@Entity(TableNameEnum.ORDERS)
export class OrderEntity extends CreateUpdateModel {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column({ type: 'varchar', length: 25 })
  name: string;

  @Column({ type: 'varchar', length: 25 })
  surname: string;

  @Column({ type: 'varchar', length: 100 })
  email: string;

  @Column({ type: 'varchar', length: 12 })
  phone: string;

  @Column({ type: 'int' })
  age: number;

  @Column({ type: 'varchar', length: 10 })
  course: string;

  @Column({ type: 'varchar', length: 15 })
  course_format: string;

  @Column({ type: 'varchar', length: 100 })
  course_type: string;

  @Column({ type: 'int' })
  sum: number;

  @Column({ type: 'int', default: 0 })
  alreadyPaid: number;

  @Column({ type: 'varchar', length: 100, nullable: true })
  utm?: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  msg?: string;

  @Column({ type: 'varchar', length: 15, default: 'pending' })
  status: string;
}
