import { MigrationInterface, QueryRunner } from "typeorm";

export class AddUserLoginInfo1667766250340 implements MigrationInterface {
    name = 'AddUserLoginInfo1667766250340'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`users\` ADD \`number_logins\` int NOT NULL DEFAULT '0'`);
        await queryRunner.query(`ALTER TABLE \`users\` ADD \`last_logged_in\` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`users\` DROP COLUMN \`last_logged_in\``);
        await queryRunner.query(`ALTER TABLE \`users\` DROP COLUMN \`number_logins\``);
    }

}
