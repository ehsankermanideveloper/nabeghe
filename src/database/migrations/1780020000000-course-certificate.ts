import { MigrationInterface, QueryRunner } from 'typeorm';

export class CourseCertificate1780020000000 implements MigrationInterface {
  name = 'CourseCertificate1780020000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS "public"."course_certificate" (
        "id" SERIAL NOT NULL,
        "createdAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
        "updatedAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
        "deletedAt" TIMESTAMP,
        "version" integer NOT NULL DEFAULT 1,
        "user_id" integer NOT NULL,
        "course_id" integer NOT NULL,
        "code" character varying(36) NOT NULL,
        "issued_at" TIMESTAMP NOT NULL,
        CONSTRAINT "UQ_course_certificate_code" UNIQUE ("code"),
        CONSTRAINT "UQ_course_certificate_user_course" UNIQUE ("user_id", "course_id"),
        CONSTRAINT "PK_course_certificate" PRIMARY KEY ("id")
      )
    `);
    await queryRunner.query(`CREATE INDEX IF NOT EXISTS "IDX_course_certificate_user_id" ON "public"."course_certificate" ("user_id")`);
    await queryRunner.query(`CREATE INDEX IF NOT EXISTS "IDX_course_certificate_course_id" ON "public"."course_certificate" ("course_id")`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP INDEX IF EXISTS "IDX_course_certificate_course_id"`);
    await queryRunner.query(`DROP INDEX IF EXISTS "IDX_course_certificate_user_id"`);
    await queryRunner.query(`DROP TABLE IF EXISTS "public"."course_certificate"`);
  }
}
