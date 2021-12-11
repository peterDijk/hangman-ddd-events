import { CommandHandler, EventPublisher, ICommandHandler } from '@nestjs/cqrs';
import { Logger } from '@nestjs/common';
import { GamesRepository } from '../../Domain/Repositories/GamesRepository';
import { GuessLetterCommand } from '../Commands/GuessLetter.command';

@CommandHandler(GuessLetterCommand)
export class GuessLetterCommandHandler
  implements ICommandHandler<GuessLetterCommand> {
  private readonly logger = new Logger(GuessLetterCommandHandler.name);

  constructor(
    private publisher: EventPublisher,
    private readonly repository: GamesRepository, // private readonly petersPublisher: unknown, // private readonly publisher: StoreEventPublisher,
  ) {}

  async execute({ gameId, letter }: GuessLetterCommand) {
    // call own publish method
    //
    const game = this.publisher.mergeObjectContext(
      await this.repository.guessLetter(gameId, letter),
    );
    game.commit();
  }
}
