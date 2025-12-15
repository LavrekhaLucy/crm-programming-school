import { MigrationInterface, QueryRunner } from 'typeorm';

export class InitDatabase1765820718076 implements MigrationInterface {
  name = 'InitDatabase1765820718076';

  public async up(_queryRunner: QueryRunner): Promise<void> {
    /**
     * Initial database migration.
     *
     * Database and table `orders` were created manually using SQL dump.
     * This migration marks the starting point for TypeORM migrations.
     *
     * No schema changes are applied here.
     */
  }

  public async down(_queryRunner: QueryRunner): Promise<void> {
    /**
     * No rollback for initial migration
     */
  }
}
