import { MigrationInterface, QueryRunner } from "typeorm";

export class RolePermissionAlterFieldName1692388286686 implements MigrationInterface {
    name = 'RolePermissionAlterFieldName1692388286686'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "permission" DROP COLUMN "entity"`);
        await queryRunner.query(`ALTER TABLE "permission" DROP COLUMN "method"`);
        await queryRunner.query(`ALTER TABLE "permission" ADD "name" character varying NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "permission" DROP COLUMN "name"`);
        await queryRunner.query(`ALTER TABLE "permission" ADD "method" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "permission" ADD "entity" character varying NOT NULL`);
    }

}
