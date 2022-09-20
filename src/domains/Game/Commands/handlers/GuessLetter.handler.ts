import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { Logger } from '@nestjs/common';
import { StoreEventPublisher } from '@peterdijk/nestjs-eventstoredb';
import { performance, PerformanceObserver } from 'perf_hooks';

import { GamesRepository } from '../../Games.repository';
import { GuessLetterCommand } from '../GuessLetter.command';

@CommandHandler(GuessLetterCommand)
export class GuessLetterCommandHandler
  implements ICommandHandler<GuessLetterCommand>
{
  private readonly logger = new Logger(GuessLetterCommandHandler.name);

  private observer = new PerformanceObserver((items) =>
    items.getEntries().forEach((entry) => this.logger.log(entry)),
  ).observe({ entryTypes: ['measure'] });

  constructor(
    private publisher: StoreEventPublisher,
    private readonly repository: GamesRepository,
  ) {}

  async execute({ gameId, letter }: GuessLetterCommand) {
    this.logger.debug('execute command');
    const aggregate = await this.repository.findOneById(gameId);
    await aggregate.guessLetter(letter);
    // performance.mark('stop-guess');
    this.logger.log(
      `total num guesses: ${aggregate.lettersGuessed.value.length}`,
    );
    // performance.measure('Measurement', 'start-guess', 'stop-guess');
    const game = this.publisher.mergeObjectContext(aggregate);
    game.commit();
  }
}
