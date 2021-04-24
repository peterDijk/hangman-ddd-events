import {MigrationInterface, QueryRunner} from "typeorm";

export class AddGameProjection1619285504640 implements MigrationInterface {
    name = 'AddGameProjection1619285504640'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query("CREATE TABLE `games` (`game_id` varchar(255) NOT NULL, `name` varchar(255) NOT NULL, PRIMARY KEY (`game_id`)) ENGINE=InnoDB");
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query("DROP TABLE `games`");
    }

}
