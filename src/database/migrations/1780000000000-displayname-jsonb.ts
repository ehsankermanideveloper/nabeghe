import { MigrationInterface, QueryRunner } from 'typeorm';

export class DisplaynameJsonb1780000000000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "user" ADD COLUMN "displayNameNew" jsonb`);
    await queryRunner.query(`
      UPDATE "user"
      SET "displayNameNew" = jsonb_build_object('fa', "displayName")
      WHERE "displayName" IS NOT NULL
    `);
    await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "displayName"`);
    await queryRunner.query(`ALTER TABLE "user" RENAME COLUMN "displayNameNew" TO "displayName"`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "user" ADD COLUMN "displayNameOld" character varying(120)`);
    await queryRunner.query(`
      UPDATE "user"
      SET "displayNameOld" = "displayName"->>'fa'
      WHERE "displayName" IS NOT NULL
    `);
    await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "displayName"`);
    await queryRunner.query(`ALTER TABLE "user" RENAME COLUMN "displayNameOld" TO "displayName"`);
  }
}
