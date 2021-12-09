import { Game as GameProjection } from '../../ReadModels/game.entity';

import {
  IViewUpdater,
  ViewUpdaterHandler,
} from '@berniemac/event-sourcing-nestjs';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { LetterGuessedEvent } from '../Events/LetterGuessed.event';

@ViewUpdaterHandler(LetterGuessedEvent)
export class LetterGuessedUpdater implements IViewUpdater<LetterGuessedEvent> {
  constructor(
    @InjectRepository(GameProjection)
    private gamesProjectionRepository: Repository<GameProjection>,
  ) {}

  async handle(event: LetterGuessedEvent) {
    this.gamesProjectionRepository.update(
      {
        gameId: event.game,
      },
      { lettersGuessed: event.lettersGuessed },
    );
  }
}
