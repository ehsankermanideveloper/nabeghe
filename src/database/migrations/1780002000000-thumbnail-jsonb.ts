import { MigrationInterface, QueryRunner } from 'typeorm';

/**
 * Converts thumbnail varchar(500) → jsonb on course and article.
 * Existing URLs are stored under all three locales:
 *   {"fa": "<url>", "en": "<url>", "ps": "<url>"}
 * so each language has an image from day one.
 */
export class ThumbnailJsonb1780002000000 implements MigrationInterface {
  name = 'ThumbnailJsonb1780002000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TABLE "public"."course"
        ALTER COLUMN "thumbnail" TYPE jsonb
          USING CASE
            WHEN thumbnail IS NULL THEN NULL
            ELSE jsonb_build_object('fa', thumbnail, 'en', thumbnail, 'ps', thumbnail)
          END
    `);

    await queryRunner.query(`
      ALTER TABLE "public"."article"
        ALTER COLUMN "thumbnail" TYPE jsonb
          USING CASE
            WHEN thumbnail IS NULL THEN NULL
            ELSE jsonb_build_object('fa', thumbnail, 'en', thumbnail, 'ps', thumbnail)
          END
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TABLE "public"."course"
        ALTER COLUMN "thumbnail" TYPE varchar(500)
          USING (thumbnail->>'fa')
    `);

    await queryRunner.query(`
      ALTER TABLE "public"."article"
        ALTER COLUMN "thumbnail" TYPE varchar(500)
          USING (thumbnail->>'fa')
    `);
  }
}
