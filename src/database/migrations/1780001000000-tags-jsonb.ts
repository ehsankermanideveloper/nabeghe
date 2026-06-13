import { MigrationInterface, QueryRunner } from 'typeorm';

export class TagsJsonb1780001000000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // article_tag.title varchar -> jsonb
    await queryRunner.query(`ALTER TABLE "article_tag" ADD COLUMN "titleNew" jsonb`);
    await queryRunner.query(`UPDATE "article_tag" SET "titleNew" = jsonb_build_object('fa', "title")`);
    await queryRunner.query(`ALTER TABLE "article_tag" DROP COLUMN "title"`);
    await queryRunner.query(`ALTER TABLE "article_tag" RENAME COLUMN "titleNew" TO "title"`);

    // course_tag.name varchar -> jsonb
    await queryRunner.query(`ALTER TABLE "course_tag" ADD COLUMN "nameNew" jsonb`);
    await queryRunner.query(`UPDATE "course_tag" SET "nameNew" = jsonb_build_object('fa', "name")`);
    await queryRunner.query(`ALTER TABLE "course_tag" DROP COLUMN "name"`);
    await queryRunner.query(`ALTER TABLE "course_tag" RENAME COLUMN "nameNew" TO "name"`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "article_tag" ADD COLUMN "titleOld" character varying(100)`);
    await queryRunner.query(`UPDATE "article_tag" SET "titleOld" = "title"->>'fa'`);
    await queryRunner.query(`ALTER TABLE "article_tag" DROP COLUMN "title"`);
    await queryRunner.query(`ALTER TABLE "article_tag" RENAME COLUMN "titleOld" TO "title"`);

    await queryRunner.query(`ALTER TABLE "course_tag" ADD COLUMN "nameOld" character varying(100)`);
    await queryRunner.query(`UPDATE "course_tag" SET "nameOld" = "name"->>'fa'`);
    await queryRunner.query(`ALTER TABLE "course_tag" DROP COLUMN "name"`);
    await queryRunner.query(`ALTER TABLE "course_tag" RENAME COLUMN "nameOld" TO "name"`);
  }
}
