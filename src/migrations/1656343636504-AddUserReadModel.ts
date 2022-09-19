import {MigrationInterface, QueryRunner} from "typeorm";

export class AddUserReadModel1656343636504 implements MigrationInterface {
    name = 'AddUserReadModel1656343636504'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query("CREATE TABLE `users` (`user_id` varchar(255) NOT NULL, `username` varchar(255) NOT NULL, `password` varchar(255) NOT NULL, `date_created` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP, `date_modified` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP, PRIMARY KEY (`user_id`)) ENGINE=InnoDB");
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query("DROP TABLE `users`");
    }

}
