import { MigrationInterface, QueryRunner } from 'typeorm';

export class FixTokenEntity1765961125048 implements MigrationInterface {
  name = 'FixTokenEntity1765961125048';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`tokens\` CHANGE \`IsBlocked\` \`isBlocked\` tinyint NOT NULL DEFAULT 0`,
    );

    await queryRunner.query(
      `ALTER TABLE \`tokens\` CHANGE \`accessTokenExpiresAt\` \`accessTokenExpiresAt\` datetime(6) NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE \`tokens\` CHANGE \`refreshTokenExpiresAt\` \`refreshTokenExpiresAt\` datetime(6) NOT NULL`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`tokens\` CHANGE \`refreshTokenExpiresAt\` \`refreshTokenExpiresAt\` datetime(0) NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE \`tokens\` CHANGE \`accessTokenExpiresAt\` \`accessTokenExpiresAt\` datetime(0) NOT NULL`,
    );

    await queryRunner.query(
      `ALTER TABLE \`tokens\` CHANGE \`isBlocked\` \`IsBlocked\` tinyint NOT NULL`,
    );
  }
}
