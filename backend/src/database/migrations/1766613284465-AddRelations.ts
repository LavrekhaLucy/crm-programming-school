import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddRelations1766613284465 implements MigrationInterface {
  name = 'AddRelations1766613284465';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE \`orders\` ADD \`group_id\` int NULL`);
    await queryRunner.query(
      `ALTER TABLE \`orders\` ADD CONSTRAINT \`FK_77b9403790bf253dd71cfcdb6a4\` FOREIGN KEY (\`group_id\`) REFERENCES \`groups\`(\`id\`) ON DELETE SET NULL ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`orders\` DROP FOREIGN KEY \`FK_77b9403790bf253dd71cfcdb6a4\``,
    );
    await queryRunner.query(`ALTER TABLE \`orders\` DROP COLUMN \`group_id\``);
  }
}
