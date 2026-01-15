import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateUsers1765843102984 implements MigrationInterface {
  name = 'CreateUsers1765843102984';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`CREATE TABLE \`users\` (
    \`created_at\` datetime(6) NULL DEFAULT CURRENT_TIMESTAMP(6),
    \`id\` int NOT NULL AUTO_INCREMENT,
    \`email\` varchar(100) NOT NULL,
    \`password\` varchar(100) NOT NULL,
    \`role\` enum ('manager', 'admin') NOT NULL DEFAULT 'manager',
    \`username\` varchar(25) NOT NULL,
    \`name\` varchar(25) NOT NULL,
    \`surname\` varchar(25) NOT NULL,
    \`avatarUrl\` varchar(255) NULL,
    \`isActive\` tinyint NOT NULL DEFAULT 0,
    \`locale\` varchar(10) NOT NULL DEFAULT 'en',
    \`isAdultAccepted\` tinyint NOT NULL DEFAULT 0,
    UNIQUE INDEX \`IDX_97672ac88f789774dd47f7c8be\` (\`email\`),
    UNIQUE INDEX \`IDX_fe0bb3f6520ee0469504521e71\` (\`username\`),
    PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `DROP INDEX \`IDX_fe0bb3f6520ee0469504521e71\` ON \`users\``,
    );
    await queryRunner.query(
      `DROP INDEX \`IDX_97672ac88f789774dd47f7c8be\` ON \`users\``,
    );
    await queryRunner.query(`DROP TABLE \`users\``);
  }
}
