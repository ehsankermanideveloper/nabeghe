import { MigrationInterface, QueryRunner } from 'typeorm';

export class UserBio1779494000000 implements MigrationInterface {
  name = 'UserBio1779494000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "user" ADD "bio" character varying(500)`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "bio"`);
  }
}
