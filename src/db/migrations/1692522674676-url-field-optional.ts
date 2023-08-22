import { MigrationInterface, QueryRunner } from "typeorm";

export class UrlFieldOptional1692522674676 implements MigrationInterface {
    name = 'UrlFieldOptional1692522674676'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "comment" ALTER COLUMN "url" DROP NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "comment" ALTER COLUMN "url" SET NOT NULL`);
    }

}
