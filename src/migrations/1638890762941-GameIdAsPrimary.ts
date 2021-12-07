import {MigrationInterface, QueryRunner} from "typeorm";

export class GameIdAsPrimary1638890762941 implements MigrationInterface {
    name = 'GameIdAsPrimary1638890762941'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query("ALTER TABLE `games` DROP PRIMARY KEY");
        await queryRunner.query("ALTER TABLE `games` DROP COLUMN `id`");
        await queryRunner.query("ALTER TABLE `games` ADD PRIMARY KEY (`game_id`)");
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query("ALTER TABLE `games` DROP PRIMARY KEY");
        await queryRunner.query("ALTER TABLE `games` ADD `id` varchar(36) NOT NULL");
        await queryRunner.query("ALTER TABLE `games` ADD PRIMARY KEY (`id`)");
    }

}
