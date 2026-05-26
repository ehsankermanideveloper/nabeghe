import { MigrationInterface, QueryRunner } from 'typeorm';

export class UserBirthday1779493000000 implements MigrationInterface {
  name = 'UserBirthday1779493000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "user" ADD "birthday" character varying(10)`,
    );
    await queryRunner.query(
      `ALTER TABLE "user" ADD "bio" character varying(500)`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "bio"`);
    await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "birthday"`);
  }
}
