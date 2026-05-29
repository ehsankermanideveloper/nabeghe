import { MigrationInterface, QueryRunner } from 'typeorm';

export class UserBirthday1779493000000 implements MigrationInterface {
  name = 'UserBirthday1779493000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "user" ADD "birthday" character varying(10)`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "birthday"`);
  }
}
