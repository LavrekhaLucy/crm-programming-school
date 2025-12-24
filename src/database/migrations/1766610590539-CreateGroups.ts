import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateGroups1766610590539 implements MigrationInterface {
  name = 'CreateGroups1766610590539';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE \`groups\` (\`id\` int NOT NULL AUTO_INCREMENT, \`name\` varchar(255) NOT NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE \`groups\``);
  }
}
