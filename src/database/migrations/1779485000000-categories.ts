import { MigrationInterface, QueryRunner } from 'typeorm';

export class Categories1779485000000 implements MigrationInterface {
  name = 'Categories1779485000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
CREATE TABLE IF NOT EXISTS "public"."category" (
  "id" SERIAL PRIMARY KEY,
  "createdAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "deletedAt" TIMESTAMP,
  "version" integer NOT NULL DEFAULT 1,
  "parent_id" integer,
  "title" character varying(200) NOT NULL,
  "slug" character varying(200) NOT NULL,
  "sort_order" integer NOT NULL DEFAULT 0,
  "is_active" boolean NOT NULL DEFAULT true,
  CONSTRAINT "FK_category_parent" FOREIGN KEY ("parent_id")
    REFERENCES "public"."category"("id") ON DELETE CASCADE
);
`);
    await queryRunner.query(`
CREATE UNIQUE INDEX IF NOT EXISTS "IDX_category_slug" ON "public"."category" ("slug");
`);
    await queryRunner.query(`
CREATE INDEX IF NOT EXISTS "IDX_category_parent_id" ON "public"."category" ("parent_id");
`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE IF EXISTS "public"."category";`);
  }
}
