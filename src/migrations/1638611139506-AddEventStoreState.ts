import {MigrationInterface, QueryRunner} from "typeorm";

export class AddEventStoreState1638611139506 implements MigrationInterface {
    name = 'AddEventStoreState1638611139506'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query("CREATE TABLE `event_store_states` (`id` varchar(36) NOT NULL, `stream_name` varchar(255) NOT NULL, `last_checkpoint` int NOT NULL, PRIMARY KEY (`id`)) ENGINE=InnoDB");
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query("DROP TABLE `event_store_states`");
    }

}
