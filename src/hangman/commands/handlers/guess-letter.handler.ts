import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { StoreEventPublisher } from '@peterdijk/nestjs-eventstoredb';
import { Logger } from '@nestjs/common';

import { Game } from '../../models/game.model';
import { GamesRepository } from '../../repository/game.repository';
import { GuessLetterCommand } from '../impl/guess-letter.command';

@CommandHandler(GuessLetterCommand)
export class GuessLetterCommandHandler
  implements ICommandHandler<GuessLetterCommand> {
  private readonly logger = new Logger(GuessLetterCommandHandler.name);

  constructor(
    private publisher: StoreEventPublisher,
    private readonly repository: GamesRepository,
  ) {}

  async execute(command: GuessLetterCommand) {
    this.logger.log(`GuessLetterCommand...`);

    const { gameId, letter } = command;
    const game: Game = this.publisher.mergeObjectContext(
      await this.repository.findOneById(gameId),
    );

    await game.guessLetter(letter); // TODO: Need await here?
    game.commit();
  }
}
