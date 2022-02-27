import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { StoreEventPublisher } from '@peterdijk/nestjs-eventstoredb';

import { StartNewGameCommand } from '../impl/start-new-game.command';
import { Logger } from '@nestjs/common';
import { GamesRepository } from '../../repository/game.repository';

@CommandHandler(StartNewGameCommand)
export class StartNewGameCommandHandler
  implements ICommandHandler<StartNewGameCommand> {
  private readonly logger = new Logger(StartNewGameCommandHandler.name);

  constructor(
    private publisher: StoreEventPublisher,
    private readonly repository: GamesRepository,
  ) {}

  async execute({ data, uuid }: StartNewGameCommand) {
    const { playerId, wordToGuess, maxGuesses } = data;

    const game = this.publisher.mergeObjectContext(
      await this.repository.startNewGame(
        { playerId, wordToGuess, maxGuesses },
        uuid,
      ),
    );

    game.commit();
  }
}
