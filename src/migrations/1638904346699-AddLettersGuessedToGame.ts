import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddLettersGuessedToGame1638904346699
  implements MigrationInterface {
  name = 'AddLettersGuessedToGame1638904346699';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('ALTER TABLE `games` ADD `letters_guessed` json');
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      'ALTER TABLE `games` DROP COLUMN `letters_guessed`',
    );
  }
}
