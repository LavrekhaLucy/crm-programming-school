import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { UserEntity } from './user.entity';

@Entity()
export class TokenEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  accessToken: string;

  @Column()
  refreshToken: string;

  @Column()
  accessTokenExpiresAt: Date;

  @Column()
  refreshTokenExpiresAt: Date;

  @Column()
  IsBlocked: boolean;

  @Column()
  jti: string;

  @ManyToOne(() => UserEntity, (user: UserEntity) => user.tokens)
  user: UserEntity;
}
