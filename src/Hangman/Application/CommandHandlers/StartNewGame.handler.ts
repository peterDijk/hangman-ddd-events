import { CommandHandler, ICommandHandler, EventPublisher } from '@nestjs/cqrs';
import { StartNewGameCommand } from '../Commands/StartNewGame.command';
import { Logger } from '@nestjs/common';
import { GamesRepository } from 'src/Hangman/Domain/Repositories/GamesRepository';

@CommandHandler(StartNewGameCommand)
export class StartNewGameCommandHandler
  implements ICommandHandler<StartNewGameCommand> {
  constructor(
    private readonly repository: GamesRepository,
    private readonly publisher: EventPublisher,
  ) {}

  async execute(command: StartNewGameCommand) {
    Logger.log(
      'Async StartNewGameCommandHandler executing the StartNewGameCommand',
      JSON.stringify(command),
    );

    const { gameDto } = command;
    const game = this.publisher.mergeObjectContext(
      await this.repository.startGame(gameDto),
    );
    game.commit();
  }
}
