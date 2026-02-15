import { MigrationInterface, QueryRunner } from 'typeorm';

export class UpdateGroupEntity1771119883232 implements MigrationInterface {
  name = 'UpdateGroupEntity1771119883232';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`groups\` ADD UNIQUE INDEX \`IDX_664ea405ae2a10c264d582ee56\` (\`name\`)`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`groups\` DROP INDEX \`IDX_664ea405ae2a10c264d582ee56\``,
    );
  }
}
