import { MigrationInterface, QueryRunner } from 'typeorm';

export class DemoInitial1739570000000 implements MigrationInterface {
  name = 'DemoInitial1739570000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
CREATE TABLE IF NOT EXISTS "public"."demo" (
  "id" SERIAL PRIMARY KEY,
  "createdAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "deletedAt" TIMESTAMP,
  "version" integer NOT NULL DEFAULT 1,
  "title" character varying(500) NOT NULL
);
`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE IF EXISTS "public"."demo";`);
  }
}
