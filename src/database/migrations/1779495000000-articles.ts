import { MigrationInterface, QueryRunner } from 'typeorm';

export class Articles1779495000000 implements MigrationInterface {
  name = 'Articles1779495000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TYPE "public"."article_status_enum" AS ENUM ('draft', 'published', 'archived')
    `);
    await queryRunner.query(`
      CREATE TYPE "public"."article_comment_status_enum" AS ENUM ('pending', 'approved', 'rejected')
    `);

    await queryRunner.query(`
      CREATE TABLE "public"."article" (
        "id" SERIAL PRIMARY KEY,
        "createdAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
        "updatedAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
        "deletedAt" TIMESTAMP,
        "version" integer NOT NULL DEFAULT 1,
        "title" character varying(300) NOT NULL,
        "slug" character varying(300) NOT NULL,
        "short_description" character varying(600),
        "body" text,
        "thumbnail" character varying(500),
        "status" "public"."article_status_enum" NOT NULL DEFAULT 'draft',
        "read_time" integer NOT NULL DEFAULT 0,
        "view_count" integer NOT NULL DEFAULT 0,
        "sort_order" integer NOT NULL DEFAULT 0,
        "published_at" TIMESTAMP,
        "category_id" integer,
        "author_id" integer NOT NULL,
        CONSTRAINT "FK_article_category" FOREIGN KEY ("category_id")
          REFERENCES "public"."category"("id") ON DELETE SET NULL,
        CONSTRAINT "FK_article_author" FOREIGN KEY ("author_id")
          REFERENCES "public"."user"("id") ON DELETE RESTRICT
      )
    `);
    await queryRunner.query(`CREATE UNIQUE INDEX "IDX_article_slug" ON "public"."article" ("slug")`);
    await queryRunner.query(`CREATE INDEX "IDX_article_category_id" ON "public"."article" ("category_id")`);
    await queryRunner.query(`CREATE INDEX "IDX_article_author_id" ON "public"."article" ("author_id")`);

    await queryRunner.query(`
      CREATE TABLE "public"."article_tag" (
        "id" SERIAL PRIMARY KEY,
        "createdAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
        "updatedAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
        "deletedAt" TIMESTAMP,
        "version" integer NOT NULL DEFAULT 1,
        "article_id" integer NOT NULL,
        "title" character varying(100) NOT NULL,
        "slug" character varying(100) NOT NULL,
        CONSTRAINT "FK_article_tag_article" FOREIGN KEY ("article_id")
          REFERENCES "public"."article"("id") ON DELETE CASCADE
      )
    `);
    await queryRunner.query(`CREATE INDEX "IDX_article_tag_article_id" ON "public"."article_tag" ("article_id")`);
    await queryRunner.query(`CREATE INDEX "IDX_article_tag_slug" ON "public"."article_tag" ("slug")`);

    await queryRunner.query(`
      CREATE TABLE "public"."article_comment" (
        "id" SERIAL PRIMARY KEY,
        "createdAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
        "updatedAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
        "deletedAt" TIMESTAMP,
        "version" integer NOT NULL DEFAULT 1,
        "article_id" integer NOT NULL,
        "user_id" integer NOT NULL,
        "parent_id" integer,
        "body" text NOT NULL,
        "status" "public"."article_comment_status_enum" NOT NULL DEFAULT 'pending',
        CONSTRAINT "FK_article_comment_article" FOREIGN KEY ("article_id")
          REFERENCES "public"."article"("id") ON DELETE CASCADE,
        CONSTRAINT "FK_article_comment_user" FOREIGN KEY ("user_id")
          REFERENCES "public"."user"("id") ON DELETE CASCADE,
        CONSTRAINT "FK_article_comment_parent" FOREIGN KEY ("parent_id")
          REFERENCES "public"."article_comment"("id") ON DELETE CASCADE
      )
    `);
    await queryRunner.query(`CREATE INDEX "IDX_article_comment_article_id" ON "public"."article_comment" ("article_id")`);
    await queryRunner.query(`CREATE INDEX "IDX_article_comment_user_id" ON "public"."article_comment" ("user_id")`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE IF EXISTS "public"."article_comment"`);
    await queryRunner.query(`DROP TABLE IF EXISTS "public"."article_tag"`);
    await queryRunner.query(`DROP TABLE IF EXISTS "public"."article"`);
    await queryRunner.query(`DROP TYPE IF EXISTS "public"."article_comment_status_enum"`);
    await queryRunner.query(`DROP TYPE IF EXISTS "public"."article_status_enum"`);
  }
}
