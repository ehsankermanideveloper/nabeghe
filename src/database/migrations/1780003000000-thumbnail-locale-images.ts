import { MigrationInterface, QueryRunner } from 'typeorm';

export class ThumbnailLocaleImages1780003000000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // Set locale-specific picsum images for courses
    await queryRunner.query(`
      UPDATE "course"
      SET "thumbnail" = jsonb_set(
        jsonb_set(
          "thumbnail",
          '{en}',
          to_jsonb('https://picsum.photos/seed/course-' || slug || '-en/800/450'),
          true
        ),
        '{ps}',
        to_jsonb('https://picsum.photos/seed/course-' || slug || '-ps/800/450'),
        true
      )
      WHERE "thumbnail" IS NOT NULL
    `);

    // Set locale-specific picsum images for articles
    await queryRunner.query(`
      UPDATE "article"
      SET "thumbnail" = jsonb_set(
        jsonb_set(
          "thumbnail",
          '{en}',
          to_jsonb('https://picsum.photos/seed/article-' || slug || '-en/800/450'),
          true
        ),
        '{ps}',
        to_jsonb('https://picsum.photos/seed/article-' || slug || '-ps/800/450'),
        true
      )
      WHERE "thumbnail" IS NOT NULL
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Revert en and ps back to the fa value
    await queryRunner.query(`
      UPDATE "course"
      SET "thumbnail" = jsonb_set(
        jsonb_set(
          "thumbnail",
          '{en}',
          "thumbnail"->'fa',
          true
        ),
        '{ps}',
        "thumbnail"->'fa',
        true
      )
      WHERE "thumbnail" IS NOT NULL
    `);

    await queryRunner.query(`
      UPDATE "article"
      SET "thumbnail" = jsonb_set(
        jsonb_set(
          "thumbnail",
          '{en}',
          "thumbnail"->'fa',
          true
        ),
        '{ps}',
        "thumbnail"->'fa',
        true
      )
      WHERE "thumbnail" IS NOT NULL
    `);
  }
}
