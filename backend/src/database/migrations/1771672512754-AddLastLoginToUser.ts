import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddLastLoginToUser1771672512754 implements MigrationInterface {
  name = 'AddLastLoginToUser1771672512754';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`users\` ADD \`lastLogin\` timestamp NULL`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE \`users\` DROP COLUMN \`lastLogin\``);
  }
}
