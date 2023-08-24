import { MigrationInterface, QueryRunner } from "typeorm";

export class RedeemApproval1692702714640 implements MigrationInterface {
    name = 'RedeemApproval1692702714640'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "redeem_request" ADD "created_at" TIMESTAMP NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "redeem_request" ADD "updated_at" TIMESTAMP NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "redeem_request" ADD "deleted_at" TIMESTAMP`);
        await queryRunner.query(`ALTER TABLE "redeem_request" ADD "is_approved" boolean NOT NULL DEFAULT false`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "redeem_request" DROP COLUMN "is_approved"`);
        await queryRunner.query(`ALTER TABLE "redeem_request" DROP COLUMN "deleted_at"`);
        await queryRunner.query(`ALTER TABLE "redeem_request" DROP COLUMN "updated_at"`);
        await queryRunner.query(`ALTER TABLE "redeem_request" DROP COLUMN "created_at"`);
    }

}
