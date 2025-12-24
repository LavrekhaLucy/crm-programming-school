import {
  BeforeInsert,
  Column,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { TableNameEnum } from './enums/table-name.enum';
import { CreateUpdateModel } from './models/create-update.model';
import { IsEnum } from 'class-validator';
import { UserRoleEnum } from './enums/user-role.enum';
import * as bcrypt from 'bcrypt';
import { TokenEntity } from './token.entity';
import { Exclude } from 'class-transformer';
import { OrderEntity } from './order.entity';

@Entity(TableNameEnum.USERS)
export class UserEntity extends CreateUpdateModel {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column({ type: 'varchar', length: 100, unique: true })
  email: string;

  @Exclude()
  @Column({ type: 'varchar', length: 100, select: false })
  password: string;

  @IsEnum(UserRoleEnum)
  @Column({ type: 'enum', enum: UserRoleEnum, default: 'manager' })
  role: UserRoleEnum;

  @Column({ type: 'varchar', length: 25, unique: true })
  username: string;

  @Column({ type: 'varchar', length: 25 })
  name: string;

  @Column({ type: 'varchar', length: 25 })
  surname: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  avatarUrl: string | null;

  @Column({ type: 'boolean', default: false })
  isActive: boolean;

  @Column({ type: 'varchar', length: 10, default: 'en' })
  locale: string;

  @Column({ type: 'boolean', default: false })
  isAdultAccepted: boolean;

  @OneToMany(() => TokenEntity, (token: TokenEntity) => token.user)
  tokens: TokenEntity[];

  @OneToMany(() => OrderEntity, (order) => order.manager)
  orders: OrderEntity[];

  @BeforeInsert()
  async hashPassword() {
    this.password = await bcrypt.hash(this.password, 10);
  }

  async validatePassword(password: string): Promise<boolean> {
    return bcrypt.compare(password, this.password);
  }
}
