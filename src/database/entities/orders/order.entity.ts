import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';
import { CreateUpdateModel } from '../models/create-update.model';
import { TableNameEnum } from '../enums/table-name.enum';

@Entity(TableNameEnum.ORDERS)
export class OrderEntity extends CreateUpdateModel {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column({ type: 'varchar', length: 25, nullable: true })
  name?: string;

  @Column({ type: 'varchar', length: 25, nullable: true })
  surname?: string;

  @Column({ type: 'varchar', length: 100, nullable: true, unique: true })
  email?: string;

  @Column({ type: 'varchar', length: 12, nullable: true })
  phone?: string;

  @Column({ type: 'int', nullable: true })
  age?: number;

  @Column({ type: 'varchar', length: 10, nullable: true })
  course?: string;

  @Column({ type: 'varchar', length: 15, nullable: true })
  course_format?: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  course_type?: string;

  @Column({ type: 'int', nullable: true })
  sum?: number;

  @Column({ type: 'int', default: 0 })
  alreadyPaid: number;

  @Column({ type: 'varchar', length: 100, nullable: true })
  utm?: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  msg?: string;

  @Column({ type: 'varchar', length: 15, nullable: true })
  status?: string;
}
