import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateTokens1765846179338 implements MigrationInterface {
  name = 'CreateTokens1765846179338';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE \`tokens\` (\`created_at\` datetime(6) NULL DEFAULT CURRENT_TIMESTAMP(6), \`updated_at\` datetime(6) NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`id\` int NOT NULL AUTO_INCREMENT, \`accessToken\` varchar(255) NOT NULL, \`refreshToken\` varchar(255) NOT NULL, \`accessTokenExpiresAt\` datetime NOT NULL, \`refreshTokenExpiresAt\` datetime NOT NULL, \`IsBlocked\` tinyint NOT NULL, \`jti\` varchar(255) NOT NULL, \`userId\` int NOT NULL, UNIQUE INDEX \`IDX_7d4251c84698d0633156759f5e\` (\`jti\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `ALTER TABLE \`users\` ADD \`updated_at\` datetime(6) NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6)`,
    );
    await queryRunner.query(
      `ALTER TABLE \`tokens\` ADD CONSTRAINT \`FK_d417e5d35f2434afc4bd48cb4d2\` FOREIGN KEY (\`userId\`) REFERENCES \`users\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`tokens\` DROP FOREIGN KEY \`FK_d417e5d35f2434afc4bd48cb4d2\``,
    );
    await queryRunner.query(`ALTER TABLE \`users\` DROP COLUMN \`updated_at\``);
    await queryRunner.query(
      `DROP INDEX \`IDX_7d4251c84698d0633156759f5e\` ON \`tokens\``,
    );
    await queryRunner.query(`DROP TABLE \`tokens\``);
  }
}
