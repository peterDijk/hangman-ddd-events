import {MigrationInterface, QueryRunner} from "typeorm";

export class AddDateCreatedModifiedGame1639087599485 implements MigrationInterface {
    name = 'AddDateCreatedModifiedGame1639087599485'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query("ALTER TABLE `games` ADD `date_created` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP");
        await queryRunner.query("ALTER TABLE `games` ADD `date_modified` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP");
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query("ALTER TABLE `games` DROP COLUMN `date_modified`");
        await queryRunner.query("ALTER TABLE `games` DROP COLUMN `date_created`");
    }

}
