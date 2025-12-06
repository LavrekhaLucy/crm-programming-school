import { CreateDateColumn } from 'typeorm';

export class CreateUpdateModel {
  @CreateDateColumn({ type: 'datetime', nullable: true })
  created_at?: Date;
}
