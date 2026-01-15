import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateComments1766751420024 implements MigrationInterface {
  name = 'CreateComments1766751420024';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE \`comments\` (
  \`id\`   int  NOT NULL AUTO_INCREMENT,
   \`text\` text NOT NULL,
    \`created_at\` datetime(6) NULL DEFAULT CURRENT_TIMESTAMP(6),
     \`updated_at\` datetime(6) NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
    PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE \`comments\``);
  }
}
