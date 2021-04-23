import { CommandHandler, ICommandHandler, EventPublisher } from '@nestjs/cqrs';
import { StartNewGameCommand } from '../Commands/StartNewGame.command';
import { Logger } from '@nestjs/common';
import { GamesRepository } from 'src/Hangman/Domain/Repositories/GamesRepository';

@CommandHandler(StartNewGameCommand)
export class StartNewGameCommandHandler
  implements ICommandHandler<StartNewGameCommand> {
  private readonly logger = new Logger(StartNewGameCommandHandler.name);

  constructor(
    private readonly repository: GamesRepository,
    private readonly publisher: EventPublisher,
  ) {}

  async execute(command: StartNewGameCommand) {
    this.logger.log({ command });
    const { gameId, playerId, wordToGuess, maxGuesses } = command;

    const game = this.publisher.mergeObjectContext(
      // returned een aggregate met daarin applied NewGameStartedEvent
      await this.repository.startNewGame(
        gameId,
        playerId,
        wordToGuess,
        maxGuesses,
      ),
    );
    game.commit(); // hier wordt het event naar de publisher (eventstore) gestuurd, volgende stap is event handler
  }
}
