import { MigrationInterface, QueryRunner } from 'typeorm';

export class ArticleWishlist1779498000000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
CREATE TABLE IF NOT EXISTS "public"."article_wishlist" (
  "id" SERIAL PRIMARY KEY,
  "createdAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "deletedAt" TIMESTAMP,
  "version" integer NOT NULL DEFAULT 1,
  "user_id" integer NOT NULL,
  "article_id" integer NOT NULL,
  CONSTRAINT "FK_article_wishlist_user" FOREIGN KEY ("user_id")
    REFERENCES "public"."user"("id") ON DELETE CASCADE,
  CONSTRAINT "FK_article_wishlist_article" FOREIGN KEY ("article_id")
    REFERENCES "public"."article"("id") ON DELETE CASCADE,
  CONSTRAINT "UQ_article_wishlist_user_article" UNIQUE ("user_id", "article_id")
);
`);
    await queryRunner.query(`CREATE INDEX IF NOT EXISTS "IDX_article_wishlist_user_id" ON "public"."article_wishlist" ("user_id");`);
    await queryRunner.query(`CREATE INDEX IF NOT EXISTS "IDX_article_wishlist_article_id" ON "public"."article_wishlist" ("article_id");`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE IF EXISTS "public"."article_wishlist";`);
  }
}
