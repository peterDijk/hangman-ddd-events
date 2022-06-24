import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { StoreEventPublisher } from '@peterdijk/nestjs-eventstoredb';

import { StartNewGameCommand } from '../Commands/StartNewGame.command';
import { Logger } from '@nestjs/common';
import { Game } from '../../Domain/AggregateRoot/Game.aggregate';

@CommandHandler(StartNewGameCommand)
export class StartNewGameCommandHandler
  implements ICommandHandler<StartNewGameCommand> {
  private readonly logger = new Logger(StartNewGameCommandHandler.name);

  constructor(private publisher: StoreEventPublisher) {}

  async execute({ data, uuid }: StartNewGameCommand) {
    const aggregate = new Game(uuid);
    await aggregate.startNewGame(data);

    const game = this.publisher.mergeObjectContext(aggregate);

    game.commit();
  }
}
