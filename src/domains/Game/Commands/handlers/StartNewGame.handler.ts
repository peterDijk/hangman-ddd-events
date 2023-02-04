import { CommandHandler, EventPublisher, ICommandHandler } from '@nestjs/cqrs';
import { StoreEventPublisher } from '@peterdijk/nestjs-eventstoredb';

import { StartNewGameCommand } from '../StartNewGame.command';
import { Logger } from '@nestjs/common';
import { Game } from '../../Game.aggregate';
import { UserRepository } from '../../../User/User.repository';

@CommandHandler(StartNewGameCommand)
export class StartNewGameCommandHandler
  implements ICommandHandler<StartNewGameCommand>
{
  private readonly logger = new Logger(StartNewGameCommandHandler.name);

  constructor(
    private publisher: StoreEventPublisher,
    private userRepository: UserRepository,
  ) {}

  async execute({ data, uuid, user }: StartNewGameCommand): Promise<Game> {
    const aggregate = new Game(uuid, this.userRepository, user);
    await aggregate.startNewGame(data);
    const game = this.publisher.mergeObjectContext(aggregate);
    this.logger.log(game);
    game.commit();
    return game;
  }
}
