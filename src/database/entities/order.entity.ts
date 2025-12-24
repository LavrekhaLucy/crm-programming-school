import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { TableNameEnum } from './enums/table-name.enum';
import { CoursesEnum } from './enums/courses.enum';
import { FormatsEnum } from './enums/formats.enum';
import { TypesEnum } from './enums/types.enum';
import { StatusesEnum } from './enums/statuses.enum';
import { UserEntity } from './user.entity';
import { GroupEntity } from './group.entity';

@Entity(TableNameEnum.ORDERS)
export class OrderEntity {
  @PrimaryGeneratedColumn({ type: 'bigint' })
  id: string;

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
  course?: CoursesEnum;

  @Column({ type: 'varchar', length: 15, nullable: true })
  course_format?: FormatsEnum;

  @Column({ type: 'varchar', length: 100, nullable: true })
  course_type?: TypesEnum;

  @CreateDateColumn({ type: 'datetime', nullable: true })
  created_at?: Date;

  @Column({ type: 'varchar', length: 15, nullable: true })
  status?: StatusesEnum;

  @Column({ type: 'int', nullable: true })
  sum?: number;

  @Column({ type: 'int', default: 0 })
  alreadyPaid: number;

  @Column({ type: 'varchar', length: 100, nullable: true })
  utm?: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  msg?: string;

  @ManyToOne(() => UserEntity, (user) => user.orders, {
    onDelete: 'SET NULL',
    nullable: true,
  })
  @JoinColumn({
    name: 'manager_id',
    foreignKeyConstraintName: 'fk_orders_manager',
  })
  manager: UserEntity;

  @ManyToOne(() => GroupEntity, (group) => group.orders, {
    nullable: true,
    onDelete: 'SET NULL',
  })
  @JoinColumn({ name: 'group_id' })
  group: GroupEntity;

  //
  // @OneToMany(() => CommentEntity, (entity) => entity.order)
  // comments?: CommentEntity[];
}
