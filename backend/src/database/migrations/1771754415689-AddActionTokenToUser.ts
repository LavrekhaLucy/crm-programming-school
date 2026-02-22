import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddActionTokenToUser1771754415689 implements MigrationInterface {
  name = 'AddActionTokenToUser1771754415689';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`users\` ADD \`actionToken\` varchar(255) NULL`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`users\` DROP COLUMN \`actionToken\``,
    );
  }
}
