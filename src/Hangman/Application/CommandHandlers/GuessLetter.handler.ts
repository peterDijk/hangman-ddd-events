import { CommandHandler, ICommandHandler, EventPublisher } from '@nestjs/cqrs';
import { Logger } from '@nestjs/common';
import { GamesRepository } from '../../Domain/Repositories/GamesRepository';
import { GuessLetterCommand } from '../Commands/GuessLetter.command';

@CommandHandler(GuessLetterCommand)
export class GuessLetterCommandHandler
  implements ICommandHandler<GuessLetterCommand> {
  private readonly logger = new Logger(GuessLetterCommandHandler.name);

  constructor(
    private readonly repository: GamesRepository,
    private readonly publisher: EventPublisher,
  ) {}

  async execute({ gameId, letter }: GuessLetterCommand) {
    const game = this.publisher.mergeObjectContext(
      // returned een aggregate met daarin applied NewGameStartedEvent
      await this.repository.guessLetterRep(gameId, letter),
    );
    game.commit(); // hier wordt het event naar de publisher (eventstore) gestuurd, volgende stap is event handler
  }
}
