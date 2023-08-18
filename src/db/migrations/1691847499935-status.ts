import { MigrationInterface, QueryRunner } from "typeorm";

export class Status1691847499935 implements MigrationInterface {
    name = 'Status1691847499935'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "employee" RENAME COLUMN "is_active" TO "status"`);
        await queryRunner.query(`ALTER TABLE "employee" DROP COLUMN "status"`);
        await queryRunner.query(`ALTER TABLE "employee" ADD "status" character varying NOT NULL DEFAULT 'ACTIVE'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "employee" DROP COLUMN "status"`);
        await queryRunner.query(`ALTER TABLE "employee" ADD "status" boolean`);
        await queryRunner.query(`ALTER TABLE "employee" RENAME COLUMN "status" TO "is_active"`);
    }

}
