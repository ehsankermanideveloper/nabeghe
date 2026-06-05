import { MigrationInterface, QueryRunner } from 'typeorm';

export class Passkeys1779497000000 implements MigrationInterface {
  name = 'Passkeys1779497000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TABLE "passkey" (
        "id"           SERIAL PRIMARY KEY,
        "createdAt"    TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
        "updatedAt"    TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
        "deletedAt"    TIMESTAMP WITH TIME ZONE,
        "version"      INTEGER NOT NULL DEFAULT 1,
        "user_id"      INTEGER NOT NULL REFERENCES "user"(id) ON DELETE CASCADE,
        "credentialId" VARCHAR(512) NOT NULL,
        "publicKey"    BYTEA NOT NULL,
        "counter"      BIGINT NOT NULL DEFAULT 0,
        "deviceType"   VARCHAR(32) NOT NULL,
        "backedUp"     BOOLEAN NOT NULL DEFAULT FALSE,
        "transports"   TEXT,
        "name"         VARCHAR(120)
      )
    `);
    await queryRunner.query(
      `CREATE UNIQUE INDEX "UQ_passkey_credentialId" ON "passkey" ("credentialId") WHERE "deletedAt" IS NULL`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_passkey_userId" ON "passkey" ("user_id")`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "passkey"`);
  }
}
