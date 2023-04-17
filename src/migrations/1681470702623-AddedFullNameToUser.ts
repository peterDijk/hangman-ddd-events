import { MigrationInterface, QueryRunner } from "typeorm";

export class AddedFullNameToUser1681470702623 implements MigrationInterface {
    name = 'AddedFullNameToUser1681470702623'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`users\` ADD \`full_name\` varchar(255) NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`users\` DROP COLUMN \`full_name\``);
    }

}
