import { MigrationInterface, QueryRunner } from 'typeorm';

/**
 * Converts multilingual VARCHAR/TEXT columns to JSONB.
 * Existing data is wrapped as {"fa": "original value"}.
 * Adds GIN indexes on search-heavy columns for performance.
 */
export class I18nJsonb1779999000000 implements MigrationInterface {
  name = 'I18nJsonb1779999000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    // ── course ──────────────────────────────────────────────────────────────
    await queryRunner.query(`
      ALTER TABLE "public"."course"
        ALTER COLUMN "title"             TYPE jsonb USING jsonb_build_object('fa', title),
        ALTER COLUMN "short_description" TYPE jsonb USING CASE
          WHEN short_description IS NULL THEN NULL
          ELSE jsonb_build_object('fa', short_description)
        END,
        ALTER COLUMN "description"       TYPE jsonb USING CASE
          WHEN description IS NULL THEN NULL
          ELSE jsonb_build_object('fa', description)
        END
    `);

    // ── article ─────────────────────────────────────────────────────────────
    await queryRunner.query(`
      ALTER TABLE "public"."article"
        ALTER COLUMN "title"             TYPE jsonb USING jsonb_build_object('fa', title),
        ALTER COLUMN "short_description" TYPE jsonb USING CASE
          WHEN short_description IS NULL THEN NULL
          ELSE jsonb_build_object('fa', short_description)
        END,
        ALTER COLUMN "body"              TYPE jsonb USING CASE
          WHEN body IS NULL THEN NULL
          ELSE jsonb_build_object('fa', body)
        END
    `);

    // ── category ─────────────────────────────────────────────────────────────
    await queryRunner.query(`
      ALTER TABLE "public"."category"
        ALTER COLUMN "title" TYPE jsonb USING jsonb_build_object('fa', title)
    `);

    // ── course_chapter ────────────────────────────────────────────────────────
    await queryRunner.query(`
      ALTER TABLE "public"."course_chapter"
        ALTER COLUMN "title" TYPE jsonb USING jsonb_build_object('fa', title)
    `);

    // ── course_episode ────────────────────────────────────────────────────────
    await queryRunner.query(`
      ALTER TABLE "public"."course_episode"
        ALTER COLUMN "title"       TYPE jsonb USING jsonb_build_object('fa', title),
        ALTER COLUMN "description" TYPE jsonb USING CASE
          WHEN description IS NULL THEN NULL
          ELSE jsonb_build_object('fa', description)
        END
    `);

    // ── GIN indexes for full-text search on search-hit columns ───────────────
    await queryRunner.query(`
      CREATE INDEX IF NOT EXISTS "idx_course_title_gin"
        ON "public"."course" USING gin (title)
    `);
    await queryRunner.query(`
      CREATE INDEX IF NOT EXISTS "idx_course_short_desc_gin"
        ON "public"."course" USING gin (short_description) WHERE short_description IS NOT NULL
    `);
    await queryRunner.query(`
      CREATE INDEX IF NOT EXISTS "idx_article_title_gin"
        ON "public"."article" USING gin (title)
    `);
    await queryRunner.query(`
      CREATE INDEX IF NOT EXISTS "idx_article_short_desc_gin"
        ON "public"."article" USING gin (short_description) WHERE short_description IS NOT NULL
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Drop GIN indexes
    await queryRunner.query(`DROP INDEX IF EXISTS "idx_course_title_gin"`);
    await queryRunner.query(`DROP INDEX IF EXISTS "idx_course_short_desc_gin"`);
    await queryRunner.query(`DROP INDEX IF EXISTS "idx_article_title_gin"`);
    await queryRunner.query(`DROP INDEX IF EXISTS "idx_article_short_desc_gin"`);

    // Revert course
    await queryRunner.query(`
      ALTER TABLE "public"."course"
        ALTER COLUMN "title"             TYPE varchar(200) USING (title->>'fa'),
        ALTER COLUMN "short_description" TYPE varchar(500) USING (short_description->>'fa'),
        ALTER COLUMN "description"       TYPE text         USING (description->>'fa')
    `);

    // Revert article
    await queryRunner.query(`
      ALTER TABLE "public"."article"
        ALTER COLUMN "title"             TYPE varchar(300) USING (title->>'fa'),
        ALTER COLUMN "short_description" TYPE varchar(600) USING (short_description->>'fa'),
        ALTER COLUMN "body"              TYPE text         USING (body->>'fa')
    `);

    // Revert category
    await queryRunner.query(`
      ALTER TABLE "public"."category"
        ALTER COLUMN "title" TYPE varchar(200) USING (title->>'fa')
    `);

    // Revert course_chapter
    await queryRunner.query(`
      ALTER TABLE "public"."course_chapter"
        ALTER COLUMN "title" TYPE varchar(200) USING (title->>'fa')
    `);

    // Revert course_episode
    await queryRunner.query(`
      ALTER TABLE "public"."course_episode"
        ALTER COLUMN "title"       TYPE varchar(200) USING (title->>'fa'),
        ALTER COLUMN "description" TYPE text         USING (description->>'fa')
    `);
  }
}
