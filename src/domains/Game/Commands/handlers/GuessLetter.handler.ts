import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import {
  BadRequestException,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';
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

  async execute({
    gameId,
    letter,
    user: loggedInUser,
  }: GuessLetterCommand): Promise<Game> {
    // is logged in user allowed to make the guess ?

    const game = await this.repository.findOneById(gameId);

    if (!game) {
      throw new BadRequestException('Cant find game with this ID');
    }

    if (game.player.id !== loggedInUser.id) {
      throw new UnauthorizedException(
        'not allowed to make a guess for a game owned by another player',
      );
    }
    await game.guessLetter(letter);
    this.publisher.mergeObjectContext(game);
    game.commit();
    this.repository.updateOrCreate(game);
    return game;
  }
}
