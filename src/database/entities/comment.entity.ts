// import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
// import { CreateUpdateModel } from './models/create-update.model';
// import { TableNameEnum } from './enums/table-name.enum';
//
// @Entity(TableNameEnum.COMMENT)
// export class CommentEntity extends CreateUpdateModel {
//   @PrimaryGeneratedColumn('increment')
//   id: number;
//
//   @Column('text')
//   text: string;
//
//   @Column()
//   order_id: number;
//
//   @Column()
//   user_id: number;

// @ManyToOne(() => OrderEntity, (entity) => entity.comments)
// @JoinColumn({ name: 'order_id' })
// order: OrderEntity;
//
// @ManyToOne(() => UserEntity, (entity) => entity.comments)
// @JoinColumn({ name: 'user_id' })
// user: UserEntity;
// }
