import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { TableNameEnum } from './enums/table-name.enum';
import { CreateUpdateModel } from './models/create-update.model';
import { IsEnum } from 'class-validator';
import { UserRoleEnum } from './enums/user-role.enum';
import { TokenEntity } from './token.entity';

@Entity(TableNameEnum.USERS)
export class UserEntity extends CreateUpdateModel {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column({ type: 'varchar', length: 100, unique: true })
  email: string;

  @Column({ type: 'varchar', length: 100 })
  passwordHash: string;

  @IsEnum(UserRoleEnum)
  @Column({ type: 'enum', enum: UserRoleEnum, default: 'manager' })
  role: UserRoleEnum;

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

  // @OneToMany(() => OrderEntity, (entity) => entity.manager)
  // orders: OrderEntity[];
  //
  // @OneToMany(() => CommentEntity, (entity) => entity.user)
  // comments: CommentEntity[];
}
