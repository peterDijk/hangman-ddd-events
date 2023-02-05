import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { Logger, UnauthorizedException } from '@nestjs/common';
import { StoreEventPublisher } from '@peterdijk/nestjs-eventstoredb';
import { performance, PerformanceObserver } from 'perf_hooks';

import { GamesRepository } from '../../Games.repository';
import { GuessLetterCommand } from '../GuessLetter.command';
import { Game } from '../../Game.aggregate';

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

  async execute({ gameId, letter, user }: GuessLetterCommand): Promise<Game> {
    // is logged in user allowed to make the guess ?
    const loggedInUser = user;

    const aggregate = await this.repository.findOneById(gameId);

    this.logger.debug(JSON.stringify(aggregate.player));
    if (aggregate.player.id !== loggedInUser.id) {
      throw new UnauthorizedException(
        'not allowed to make a guess for a game owned by another player',
      );
    }
    await aggregate.guessLetter(letter);
    // performance.mark('stop-guess');
    // performance.measure('Measurement', 'start-guess', 'stop-guess');
    const game = this.publisher.mergeObjectContext(aggregate);
    game.commit();
    return game;
  }
}
