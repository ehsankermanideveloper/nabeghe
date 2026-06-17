import { MigrationInterface, QueryRunner } from 'typeorm';

export class UserGoogleId1780010000000 implements MigrationInterface {
  name = 'UserGoogleId1780010000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "user" ADD "google_id" character varying(255)`);
    await queryRunner.query(`CREATE UNIQUE INDEX "IDX_user_google_id" ON "user" ("google_id") WHERE "google_id" IS NOT NULL`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP INDEX "IDX_user_google_id"`);
    await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "google_id"`);
  }
}
