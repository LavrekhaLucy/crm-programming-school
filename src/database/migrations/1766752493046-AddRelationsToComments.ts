import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddRelationsToComments1766752493046 implements MigrationInterface {
  name = 'AddRelationsToComments1766752493046';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`comments\` ADD \`order_id\` bigint NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE \`comments\` ADD \`user_id\` int NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE \`comments\` ADD CONSTRAINT \`fk_comments_order\` FOREIGN KEY (\`order_id\`) REFERENCES \`orders\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE \`comments\` ADD CONSTRAINT \`fk_comments_user\` FOREIGN KEY (\`user_id\`) REFERENCES \`users\`(\`id\`) ON DELETE SET NULL ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`comments\` DROP FOREIGN KEY \`fk_comments_user\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`comments\` DROP FOREIGN KEY \`fk_comments_order\``,
    );
    await queryRunner.query(`ALTER TABLE \`comments\` DROP COLUMN \`user_id\``);
    await queryRunner.query(
      `ALTER TABLE \`comments\` DROP COLUMN \`order_id\``,
    );
  }
}
