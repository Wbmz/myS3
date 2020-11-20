import { MigrationInterface, QueryRunner } from 'typeorm';

export class BucketMigration1605880741661 implements MigrationInterface {
    name = 'BucketMigration1605880741661';

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            `CREATE TABLE "bucket" ("id" SERIAL NOT NULL, "name" character varying NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "userId" uuid, CONSTRAINT "PK_e225107407bac585fd210381c12" PRIMARY KEY ("id"))`,
        );
        await queryRunner.query(
            `ALTER TABLE "bucket" ADD CONSTRAINT "FK_6340a5cb0613cccd1f94f4259d5" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            `ALTER TABLE "bucket" DROP CONSTRAINT "FK_6340a5cb0613cccd1f94f4259d5"`,
        );
        await queryRunner.query(`DROP TABLE "bucket"`);
    }
}
