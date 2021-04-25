import {MigrationInterface, QueryRunner} from "typeorm";

export class AddGameProjection1619350635677 implements MigrationInterface {
    name = 'AddGameProjection1619350635677'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query("CREATE TABLE `games` (`id` varchar(36) NOT NULL, `game_id` varchar(255) NOT NULL, `player_id` varchar(255) NOT NULL, `player_name` varchar(255) NOT NULL, `word_to_guess` varchar(255) NOT NULL, `max_guesses` varchar(255) NOT NULL, PRIMARY KEY (`id`)) ENGINE=InnoDB");
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query("DROP TABLE `games`");
    }

}
