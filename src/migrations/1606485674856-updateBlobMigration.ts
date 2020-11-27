import { MigrationInterface, QueryRunner } from 'typeorm';

export class updateBlobMigration1606485674856 implements MigrationInterface {
    name = 'updateBlobMigration1606485674856';

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "blob" ADD "mimetype" character varying NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "blob" DROP COLUMN "mimetype"`);
    }
}
