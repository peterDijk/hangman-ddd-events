import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { StoreEventPublisher } from '@peterdijk/nestjs-eventstoredb';
import { Logger } from '@nestjs/common';

import { Game } from '../../models/game.model';
import { GamesRepository } from '../../repository/game.repository';
import { StartNewGameCommand } from '../impl/start-new-game.command';

@CommandHandler(StartNewGameCommand)
export class StartNewGameCommandHandler
  implements ICommandHandler<StartNewGameCommand> {
  private readonly logger = new Logger(StartNewGameCommandHandler.name);

  constructor(
    private readonly repository: GamesRepository,
    private publisher: StoreEventPublisher,
  ) {}

  async execute(command: StartNewGameCommand) {
    this.logger.log(`StartNewGameCommand...`);
    const { data, uuid } = command;

    const GameModel = this.publisher.mergeClassContext(Game);
    const game = new GameModel(uuid);
    await game.startNewGame(data);

    game.commit();
  }
}
