import { CreateDateColumn, UpdateDateColumn } from 'typeorm';

export class CreateUpdateModel {
  @CreateDateColumn({ type: 'datetime', precision: 6 })
  created_at: Date;

  @UpdateDateColumn()
  updated: Date;
}
