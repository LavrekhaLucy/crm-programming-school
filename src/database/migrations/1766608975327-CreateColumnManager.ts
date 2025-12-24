import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateColumnManager1766608975327 implements MigrationInterface {
  name = 'CreateColumnManager1766608975327';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`orders\` ADD \`manager_id\` int NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE \`orders\` ADD CONSTRAINT \`fk_orders_manager\` FOREIGN KEY (\`manager_id\`) REFERENCES \`users\`(\`id\`) ON DELETE SET NULL ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`orders\` DROP FOREIGN KEY \`fk_orders_manager\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`orders\` DROP COLUMN \`manager_id\``,
    );
  }
}
