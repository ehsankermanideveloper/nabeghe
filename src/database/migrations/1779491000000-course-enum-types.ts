import { MigrationInterface, QueryRunner } from 'typeorm';

export class CourseEnumTypes1779491000000 implements MigrationInterface {
  name = 'CourseEnumTypes1779491000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`CREATE TYPE "public"."course_level_enum" AS ENUM ('beginner', 'intermediate', 'advanced', 'all_levels');`);
    await queryRunner.query(`CREATE TYPE "public"."course_status_enum" AS ENUM ('draft', 'published', 'archived');`);
    await queryRunner.query(`CREATE TYPE "public"."course_episode_status_enum" AS ENUM ('draft', 'published');`);
    await queryRunner.query(`CREATE TYPE "public"."course_comment_status_enum" AS ENUM ('pending', 'approved', 'rejected');`);

    await queryRunner.query(`ALTER TABLE "public"."course" ALTER COLUMN "level" DROP DEFAULT;`);
    await queryRunner.query(`ALTER TABLE "public"."course" ALTER COLUMN "status" DROP DEFAULT;`);
    await queryRunner.query(`ALTER TABLE "public"."course" ALTER COLUMN "level" TYPE "public"."course_level_enum" USING "level"::"public"."course_level_enum";`);
    await queryRunner.query(`ALTER TABLE "public"."course" ALTER COLUMN "status" TYPE "public"."course_status_enum" USING "status"::"public"."course_status_enum";`);
    await queryRunner.query(`ALTER TABLE "public"."course" ALTER COLUMN "level" SET DEFAULT 'all_levels'::"public"."course_level_enum";`);
    await queryRunner.query(`ALTER TABLE "public"."course" ALTER COLUMN "status" SET DEFAULT 'draft'::"public"."course_status_enum";`);

    await queryRunner.query(`ALTER TABLE "public"."course_episode" ALTER COLUMN "status" DROP DEFAULT;`);
    await queryRunner.query(`ALTER TABLE "public"."course_episode" ALTER COLUMN "status" TYPE "public"."course_episode_status_enum" USING "status"::"public"."course_episode_status_enum";`);
    await queryRunner.query(`ALTER TABLE "public"."course_episode" ALTER COLUMN "status" SET DEFAULT 'draft'::"public"."course_episode_status_enum";`);

    await queryRunner.query(`ALTER TABLE "public"."course_comment" ALTER COLUMN "status" DROP DEFAULT;`);
    await queryRunner.query(`ALTER TABLE "public"."course_comment" ALTER COLUMN "status" TYPE "public"."course_comment_status_enum" USING "status"::"public"."course_comment_status_enum";`);
    await queryRunner.query(`ALTER TABLE "public"."course_comment" ALTER COLUMN "status" SET DEFAULT 'pending'::"public"."course_comment_status_enum";`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TABLE "public"."course_comment"
        ALTER COLUMN "status" TYPE character varying(20) USING "status"::text,
        ALTER COLUMN "status" SET DEFAULT 'pending';
    `);

    await queryRunner.query(`
      ALTER TABLE "public"."course_episode"
        ALTER COLUMN "status" TYPE character varying(20) USING "status"::text,
        ALTER COLUMN "status" SET DEFAULT 'draft';
    `);

    await queryRunner.query(`
      ALTER TABLE "public"."course"
        ALTER COLUMN "level" TYPE character varying(20) USING "level"::text,
        ALTER COLUMN "level" SET DEFAULT 'all_levels',
        ALTER COLUMN "status" TYPE character varying(20) USING "status"::text,
        ALTER COLUMN "status" SET DEFAULT 'draft';
    `);

    await queryRunner.query(`DROP TYPE IF EXISTS "public"."course_comment_status_enum";`);
    await queryRunner.query(`DROP TYPE IF EXISTS "public"."course_episode_status_enum";`);
    await queryRunner.query(`DROP TYPE IF EXISTS "public"."course_status_enum";`);
    await queryRunner.query(`DROP TYPE IF EXISTS "public"."course_level_enum";`);
  }
}
