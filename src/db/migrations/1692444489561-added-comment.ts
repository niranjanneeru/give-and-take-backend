import { MigrationInterface, QueryRunner } from "typeorm";

export class AddedComment1692444489561 implements MigrationInterface {
    name = 'AddedComment1692444489561'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "comment" ("created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, "id" SERIAL NOT NULL, "comment" character varying NOT NULL, "url" character varying NOT NULL, "task_id" uuid, "postedBy" uuid, CONSTRAINT "PK_0b0e4bbc8415ec426f87f3a88e2" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "comment" ADD CONSTRAINT "FK_91256732111f039be6b212d96cd" FOREIGN KEY ("task_id") REFERENCES "task"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "comment" ADD CONSTRAINT "FK_fb1003b2f4590c802598a6de048" FOREIGN KEY ("postedBy") REFERENCES "employee"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "comment" DROP CONSTRAINT "FK_fb1003b2f4590c802598a6de048"`);
        await queryRunner.query(`ALTER TABLE "comment" DROP CONSTRAINT "FK_91256732111f039be6b212d96cd"`);
        await queryRunner.query(`DROP TABLE "comment"`);
    }

}
