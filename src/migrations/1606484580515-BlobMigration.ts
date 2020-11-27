import { MigrationInterface, QueryRunner } from 'typeorm';

export class BlobMigration1606484580515 implements MigrationInterface {
    name = 'BlobMigration1606484580515';

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            `CREATE TABLE "blob" ("id" SERIAL NOT NULL, "name" character varying NOT NULL, "path" character varying NOT NULL, "size" integer NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "bucketId" integer, CONSTRAINT "PK_96ba396dd89a9ad8b61180bcb96" PRIMARY KEY ("id"))`,
        );
        await queryRunner.query(
            `ALTER TABLE "blob" ADD CONSTRAINT "FK_616125bc203f96cf335e8de9cec" FOREIGN KEY ("bucketId") REFERENCES "bucket"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            `ALTER TABLE "blob" DROP CONSTRAINT "FK_616125bc203f96cf335e8de9cec"`,
        );
        await queryRunner.query(`DROP TABLE "blob"`);
    }
}
