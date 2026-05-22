import { MigrationInterface, QueryRunner } from 'typeorm';

export class ChangeIdToInt1779473435264 implements MigrationInterface {
  name = 'ChangeIdToInt1779473435264';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "demo" DROP CONSTRAINT "demo_pkey"`);
    await queryRunner.query(`ALTER TABLE "demo" DROP COLUMN "id"`);
    await queryRunner.query(`ALTER TABLE "demo" ADD "id" SERIAL NOT NULL`);
    await queryRunner.query(
      `ALTER TABLE "demo" ADD CONSTRAINT "PK_9d8d89f7764de19ec5a40a5f056" PRIMARY KEY ("id")`,
    );
    await queryRunner.query(
      `ALTER TABLE "demo" ALTER COLUMN "createdAt" SET DEFAULT now()`,
    );
    await queryRunner.query(
      `ALTER TABLE "demo" ALTER COLUMN "updatedAt" SET DEFAULT now()`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "demo" ALTER COLUMN "updatedAt" SET DEFAULT CURRENT_TIMESTAMP`,
    );
    await queryRunner.query(
      `ALTER TABLE "demo" ALTER COLUMN "createdAt" SET DEFAULT CURRENT_TIMESTAMP`,
    );
    await queryRunner.query(
      `ALTER TABLE "demo" DROP CONSTRAINT "PK_9d8d89f7764de19ec5a40a5f056"`,
    );
    await queryRunner.query(`ALTER TABLE "demo" DROP COLUMN "id"`);
    await queryRunner.query(
      `ALTER TABLE "demo" ADD "id" uuid NOT NULL DEFAULT uuid_generate_v4()`,
    );
    await queryRunner.query(
      `ALTER TABLE "demo" ADD CONSTRAINT "demo_pkey" PRIMARY KEY ("id")`,
    );
  }
}
