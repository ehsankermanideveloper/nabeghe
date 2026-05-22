import { MigrationInterface, QueryRunner } from "typeorm";

export class InitAuth1779482996893 implements MigrationInterface {
    name = 'InitAuth1779482996893'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "otp_challenge" ("id" SERIAL NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "version" integer NOT NULL DEFAULT '1', "identifier" character varying(255) NOT NULL, "expiresAt" TIMESTAMP NOT NULL, "attempts" integer NOT NULL DEFAULT '0', "consumedAt" TIMESTAMP, "ipAddress" character varying(45), CONSTRAINT "PK_200fe6e81812616e7f97690cb21" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_856e3e99115660daca94b2d641" ON "otp_challenge"  ("identifier") `);
        await queryRunner.query(`CREATE TABLE "user" ("id" SERIAL NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "version" integer NOT NULL DEFAULT '1', "phone" character varying(20), "email" character varying(255), "displayName" character varying(120), "role" character varying(20) NOT NULL DEFAULT 'student', "lastLoginAt" TIMESTAMP, CONSTRAINT "PK_cace4a159ff9f2512dd42373760" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE UNIQUE INDEX "IDX_b225b0e7c52f2918fc027d1e71" ON "user"  ("phone") WHERE "phone" IS NOT NULL`);
        await queryRunner.query(`CREATE UNIQUE INDEX "IDX_8d859f4dd75132411c0054c52f" ON "user"  ("email") WHERE "email" IS NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP INDEX "public"."IDX_8d859f4dd75132411c0054c52f"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_b225b0e7c52f2918fc027d1e71"`);
        await queryRunner.query(`DROP TABLE "user"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_856e3e99115660daca94b2d641"`);
        await queryRunner.query(`DROP TABLE "otp_challenge"`);
    }

}
