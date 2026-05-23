import { MigrationInterface, QueryRunner } from 'typeorm';

export class Courses1779490000000 implements MigrationInterface {
  name = 'Courses1779490000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
CREATE TABLE IF NOT EXISTS "public"."course" (
  "id" SERIAL PRIMARY KEY,
  "createdAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "deletedAt" TIMESTAMP,
  "version" integer NOT NULL DEFAULT 1,
  "title" character varying(200) NOT NULL,
  "slug" character varying(200) NOT NULL,
  "short_description" character varying(500),
  "description" text,
  "thumbnail" character varying(500),
  "preview_video" character varying(500),
  "price" integer NOT NULL DEFAULT 0,
  "discount_price" integer,
  "level" character varying(20) NOT NULL DEFAULT 'all_levels',
  "status" character varying(20) NOT NULL DEFAULT 'draft',
  "sort_order" integer NOT NULL DEFAULT 0,
  "student_count" integer NOT NULL DEFAULT 0,
  "total_duration" integer NOT NULL DEFAULT 0,
  "total_episodes" integer NOT NULL DEFAULT 0,
  "published_at" TIMESTAMP,
  "category_id" integer,
  "instructor_id" integer NOT NULL,
  CONSTRAINT "FK_course_category" FOREIGN KEY ("category_id")
    REFERENCES "public"."category"("id") ON DELETE SET NULL,
  CONSTRAINT "FK_course_instructor" FOREIGN KEY ("instructor_id")
    REFERENCES "public"."user"("id") ON DELETE RESTRICT
);
`);
    await queryRunner.query(`CREATE UNIQUE INDEX IF NOT EXISTS "IDX_course_slug" ON "public"."course" ("slug");`);
    await queryRunner.query(`CREATE INDEX IF NOT EXISTS "IDX_course_category_id" ON "public"."course" ("category_id");`);
    await queryRunner.query(`CREATE INDEX IF NOT EXISTS "IDX_course_instructor_id" ON "public"."course" ("instructor_id");`);

    await queryRunner.query(`
CREATE TABLE IF NOT EXISTS "public"."course_chapter" (
  "id" SERIAL PRIMARY KEY,
  "createdAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "deletedAt" TIMESTAMP,
  "version" integer NOT NULL DEFAULT 1,
  "course_id" integer NOT NULL,
  "title" character varying(200) NOT NULL,
  "sort_order" integer NOT NULL DEFAULT 0,
  "is_active" boolean NOT NULL DEFAULT true,
  CONSTRAINT "FK_chapter_course" FOREIGN KEY ("course_id")
    REFERENCES "public"."course"("id") ON DELETE CASCADE
);
`);
    await queryRunner.query(`CREATE INDEX IF NOT EXISTS "IDX_course_chapter_course_id" ON "public"."course_chapter" ("course_id");`);

    await queryRunner.query(`
CREATE TABLE IF NOT EXISTS "public"."course_episode" (
  "id" SERIAL PRIMARY KEY,
  "createdAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "deletedAt" TIMESTAMP,
  "version" integer NOT NULL DEFAULT 1,
  "course_id" integer NOT NULL,
  "chapter_id" integer,
  "title" character varying(200) NOT NULL,
  "slug" character varying(200) NOT NULL,
  "description" text,
  "video_url" character varying(500),
  "video_duration" integer,
  "attachment_url" character varying(500),
  "sort_order" integer NOT NULL DEFAULT 0,
  "is_free" boolean NOT NULL DEFAULT false,
  "status" character varying(20) NOT NULL DEFAULT 'draft',
  CONSTRAINT "FK_episode_course" FOREIGN KEY ("course_id")
    REFERENCES "public"."course"("id") ON DELETE CASCADE,
  CONSTRAINT "FK_episode_chapter" FOREIGN KEY ("chapter_id")
    REFERENCES "public"."course_chapter"("id") ON DELETE SET NULL
);
`);
    await queryRunner.query(`CREATE INDEX IF NOT EXISTS "IDX_course_episode_course_id" ON "public"."course_episode" ("course_id");`);
    await queryRunner.query(`CREATE INDEX IF NOT EXISTS "IDX_course_episode_slug" ON "public"."course_episode" ("slug");`);

    await queryRunner.query(`
CREATE TABLE IF NOT EXISTS "public"."course_enrollment" (
  "id" SERIAL PRIMARY KEY,
  "createdAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "deletedAt" TIMESTAMP,
  "version" integer NOT NULL DEFAULT 1,
  "course_id" integer NOT NULL,
  "user_id" integer NOT NULL,
  "enrolled_at" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "FK_enrollment_course" FOREIGN KEY ("course_id")
    REFERENCES "public"."course"("id") ON DELETE CASCADE,
  CONSTRAINT "FK_enrollment_user" FOREIGN KEY ("user_id")
    REFERENCES "public"."user"("id") ON DELETE CASCADE,
  CONSTRAINT "UQ_enrollment_course_user" UNIQUE ("course_id", "user_id")
);
`);
    await queryRunner.query(`CREATE INDEX IF NOT EXISTS "IDX_enrollment_course_id" ON "public"."course_enrollment" ("course_id");`);
    await queryRunner.query(`CREATE INDEX IF NOT EXISTS "IDX_enrollment_user_id" ON "public"."course_enrollment" ("user_id");`);

    await queryRunner.query(`
CREATE TABLE IF NOT EXISTS "public"."course_progress" (
  "id" SERIAL PRIMARY KEY,
  "createdAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "deletedAt" TIMESTAMP,
  "version" integer NOT NULL DEFAULT 1,
  "user_id" integer NOT NULL,
  "course_id" integer NOT NULL,
  "episode_id" integer NOT NULL,
  "is_completed" boolean NOT NULL DEFAULT false,
  "watched_seconds" integer NOT NULL DEFAULT 0,
  "last_watched_at" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "FK_progress_user" FOREIGN KEY ("user_id")
    REFERENCES "public"."user"("id") ON DELETE CASCADE,
  CONSTRAINT "FK_progress_course" FOREIGN KEY ("course_id")
    REFERENCES "public"."course"("id") ON DELETE CASCADE,
  CONSTRAINT "FK_progress_episode" FOREIGN KEY ("episode_id")
    REFERENCES "public"."course_episode"("id") ON DELETE CASCADE,
  CONSTRAINT "UQ_progress_user_episode" UNIQUE ("user_id", "episode_id")
);
`);
    await queryRunner.query(`CREATE INDEX IF NOT EXISTS "IDX_progress_user_id" ON "public"."course_progress" ("user_id");`);
    await queryRunner.query(`CREATE INDEX IF NOT EXISTS "IDX_progress_course_id" ON "public"."course_progress" ("course_id");`);

    await queryRunner.query(`
CREATE TABLE IF NOT EXISTS "public"."course_comment" (
  "id" SERIAL PRIMARY KEY,
  "createdAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "deletedAt" TIMESTAMP,
  "version" integer NOT NULL DEFAULT 1,
  "course_id" integer NOT NULL,
  "user_id" integer NOT NULL,
  "parent_id" integer,
  "body" text NOT NULL,
  "rating" smallint,
  "status" character varying(20) NOT NULL DEFAULT 'pending',
  CONSTRAINT "FK_comment_course" FOREIGN KEY ("course_id")
    REFERENCES "public"."course"("id") ON DELETE CASCADE,
  CONSTRAINT "FK_comment_user" FOREIGN KEY ("user_id")
    REFERENCES "public"."user"("id") ON DELETE CASCADE,
  CONSTRAINT "FK_comment_parent" FOREIGN KEY ("parent_id")
    REFERENCES "public"."course_comment"("id") ON DELETE CASCADE
);
`);
    await queryRunner.query(`CREATE INDEX IF NOT EXISTS "IDX_comment_course_id" ON "public"."course_comment" ("course_id");`);
    await queryRunner.query(`CREATE INDEX IF NOT EXISTS "IDX_comment_user_id" ON "public"."course_comment" ("user_id");`);

    await queryRunner.query(`
CREATE TABLE IF NOT EXISTS "public"."course_wishlist" (
  "id" SERIAL PRIMARY KEY,
  "createdAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "deletedAt" TIMESTAMP,
  "version" integer NOT NULL DEFAULT 1,
  "user_id" integer NOT NULL,
  "course_id" integer NOT NULL,
  CONSTRAINT "FK_wishlist_user" FOREIGN KEY ("user_id")
    REFERENCES "public"."user"("id") ON DELETE CASCADE,
  CONSTRAINT "FK_wishlist_course" FOREIGN KEY ("course_id")
    REFERENCES "public"."course"("id") ON DELETE CASCADE,
  CONSTRAINT "UQ_wishlist_user_course" UNIQUE ("user_id", "course_id")
);
`);
    await queryRunner.query(`CREATE INDEX IF NOT EXISTS "IDX_wishlist_user_id" ON "public"."course_wishlist" ("user_id");`);
    await queryRunner.query(`CREATE INDEX IF NOT EXISTS "IDX_wishlist_course_id" ON "public"."course_wishlist" ("course_id");`);

    await queryRunner.query(`
CREATE TABLE IF NOT EXISTS "public"."course_tag" (
  "id" SERIAL PRIMARY KEY,
  "createdAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "deletedAt" TIMESTAMP,
  "version" integer NOT NULL DEFAULT 1,
  "course_id" integer NOT NULL,
  "name" character varying(100) NOT NULL,
  CONSTRAINT "FK_tag_course" FOREIGN KEY ("course_id")
    REFERENCES "public"."course"("id") ON DELETE CASCADE
);
`);
    await queryRunner.query(`CREATE INDEX IF NOT EXISTS "IDX_tag_course_id" ON "public"."course_tag" ("course_id");`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE IF EXISTS "public"."course_tag";`);
    await queryRunner.query(`DROP TABLE IF EXISTS "public"."course_wishlist";`);
    await queryRunner.query(`DROP TABLE IF EXISTS "public"."course_comment";`);
    await queryRunner.query(`DROP TABLE IF EXISTS "public"."course_progress";`);
    await queryRunner.query(`DROP TABLE IF EXISTS "public"."course_enrollment";`);
    await queryRunner.query(`DROP TABLE IF EXISTS "public"."course_episode";`);
    await queryRunner.query(`DROP TABLE IF EXISTS "public"."course_chapter";`);
    await queryRunner.query(`DROP TABLE IF EXISTS "public"."course";`);
  }
}
