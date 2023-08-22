import { MigrationInterface, QueryRunner } from "typeorm";

export class Redeem1692694232113 implements MigrationInterface {
    name = 'Redeem1692694232113'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "redeem_request" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "bounty" integer NOT NULL, "employee" uuid, CONSTRAINT "PK_cfc413a4a56777d07b29de675fa" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "employee" ADD "redeemed_bounty" integer NOT NULL DEFAULT '0'`);
        await queryRunner.query(`ALTER TABLE "redeem_request" ADD CONSTRAINT "FK_a1ae919a3f9cd1f0d7556a9c062" FOREIGN KEY ("employee") REFERENCES "employee"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "redeem_request" DROP CONSTRAINT "FK_a1ae919a3f9cd1f0d7556a9c062"`);
        await queryRunner.query(`ALTER TABLE "employee" DROP COLUMN "redeemed_bounty"`);
        await queryRunner.query(`DROP TABLE "redeem_request"`);
    }

}
