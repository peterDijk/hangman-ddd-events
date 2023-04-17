import {
  IViewUpdater,
  ViewUpdaterHandler,
} from '@peterdijk/nestjs-eventstoredb';
import { Game as GameProjection } from '../../../infrastructure/read-models/game.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { LetterGuessedEvent } from '../Events/LetterGuessed.event';
import { Logger } from '@nestjs/common';
import { Game } from '../Game.aggregate';
import { GamesRepository } from '../Games.repository';

@ViewUpdaterHandler(LetterGuessedEvent)
export class LetterGuessedUpdater implements IViewUpdater<LetterGuessedEvent> {
  constructor(
    @InjectRepository(GameProjection)
    private gamesProjectionRepository: Repository<GameProjection>,
    private readonly gamesRepository: GamesRepository,
  ) {}
  private logger = new Logger(LetterGuessedUpdater.name);

  async handle(event: LetterGuessedEvent) {
    const game: Game = await this.gamesRepository.findOneById(event.id);

    await this.gamesProjectionRepository.update(
      {
        gameId: event.id,
      },
      {
        lettersGuessed: game.lettersGuessed.value.map((letter) => letter.value),
        dateModified: event.dateModified,
      },
    );
  }
}
