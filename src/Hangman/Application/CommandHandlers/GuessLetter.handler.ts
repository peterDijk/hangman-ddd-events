import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { Logger } from '@nestjs/common';
import { StoreEventPublisher } from '@peterdijk/nestjs-eventstoredb';

import { GamesRepository } from '../../Domain/Repositories/GamesRepository';
import { GuessLetterCommand } from '../Commands/GuessLetter.command';

@CommandHandler(GuessLetterCommand)
export class GuessLetterCommandHandler
  implements ICommandHandler<GuessLetterCommand> {
  private readonly logger = new Logger(GuessLetterCommandHandler.name);

  constructor(
    private publisher: StoreEventPublisher,
    private readonly repository: GamesRepository,
  ) {}

  async execute({ gameId, letter }: GuessLetterCommand) {
    const game = this.publisher.mergeObjectContext(
      await this.repository.guessLetter(gameId, letter),
    );
    game.commit();
  }
}
