import { MigrationInterface, QueryRunner } from "typeorm";

export class RedeemApproval1692705235705 implements MigrationInterface {
    name = 'RedeemApproval1692705235705'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "redeem_request" ADD "approvedBy" uuid`);
        await queryRunner.query(`ALTER TABLE "redeem_request" ADD CONSTRAINT "FK_4264ab889ad6bdfb0e3cff2dd70" FOREIGN KEY ("approvedBy") REFERENCES "employee"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "redeem_request" DROP CONSTRAINT "FK_4264ab889ad6bdfb0e3cff2dd70"`);
        await queryRunner.query(`ALTER TABLE "redeem_request" DROP COLUMN "approvedBy"`);
    }

}
