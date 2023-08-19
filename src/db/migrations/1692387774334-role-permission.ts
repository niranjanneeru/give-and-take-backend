import { MigrationInterface, QueryRunner } from "typeorm";

export class RolePermission1692387774334 implements MigrationInterface {
    name = 'RolePermission1692387774334'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "employee" RENAME COLUMN "role" TO "role_id"`);
        await queryRunner.query(`CREATE TABLE "permission" ("created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, "id" SERIAL NOT NULL, "entity" character varying NOT NULL, "method" character varying NOT NULL, CONSTRAINT "PK_3b8b97af9d9d8807e41e6f48362" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "role" ("created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, "id" SERIAL NOT NULL, "name" character varying NOT NULL, CONSTRAINT "PK_b36bcfe02fc8de3c57a8b2391c2" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "role_permissions_permission" ("role_id" integer NOT NULL, "permission_id" integer NOT NULL, CONSTRAINT "PK_32d63c82505b0b1d565761ae201" PRIMARY KEY ("role_id", "permission_id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_0167acb6e0ccfcf0c6c140cec4" ON "role_permissions_permission" ("role_id") `);
        await queryRunner.query(`CREATE INDEX "IDX_2d3e8e7c82bdee8553b6f1e332" ON "role_permissions_permission" ("permission_id") `);
        await queryRunner.query(`ALTER TABLE "employee" DROP COLUMN "role_id"`);
        await queryRunner.query(`ALTER TABLE "employee" ADD "role_id" integer`);
        await queryRunner.query(`ALTER TABLE "employee" ADD CONSTRAINT "FK_1c105b756816efbdeae09a9ab65" FOREIGN KEY ("role_id") REFERENCES "role"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "role_permissions_permission" ADD CONSTRAINT "FK_0167acb6e0ccfcf0c6c140cec4a" FOREIGN KEY ("role_id") REFERENCES "role"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "role_permissions_permission" ADD CONSTRAINT "FK_2d3e8e7c82bdee8553b6f1e3325" FOREIGN KEY ("permission_id") REFERENCES "permission"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "role_permissions_permission" DROP CONSTRAINT "FK_2d3e8e7c82bdee8553b6f1e3325"`);
        await queryRunner.query(`ALTER TABLE "role_permissions_permission" DROP CONSTRAINT "FK_0167acb6e0ccfcf0c6c140cec4a"`);
        await queryRunner.query(`ALTER TABLE "employee" DROP CONSTRAINT "FK_1c105b756816efbdeae09a9ab65"`);
        await queryRunner.query(`ALTER TABLE "employee" DROP COLUMN "role_id"`);
        await queryRunner.query(`ALTER TABLE "employee" ADD "role_id" character varying NOT NULL DEFAULT 'DEVELOPER'`);
        await queryRunner.query(`DROP INDEX "public"."IDX_2d3e8e7c82bdee8553b6f1e332"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_0167acb6e0ccfcf0c6c140cec4"`);
        await queryRunner.query(`DROP TABLE "role_permissions_permission"`);
        await queryRunner.query(`DROP TABLE "role"`);
        await queryRunner.query(`DROP TABLE "permission"`);
        await queryRunner.query(`ALTER TABLE "employee" RENAME COLUMN "role_id" TO "role"`);
    }

}
