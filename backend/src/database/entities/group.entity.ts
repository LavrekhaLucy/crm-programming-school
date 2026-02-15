import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { OrderEntity } from './order.entity';
import { TableNameEnum } from './enums/table-name.enum';

@Entity(TableNameEnum.GROUPS)
export class GroupEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  name: string;

  @OneToMany(() => OrderEntity, (order) => order.group)
  orders: OrderEntity[];
}
