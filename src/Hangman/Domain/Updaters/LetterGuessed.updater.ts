import { Game as GameProjection } from '../../ReadModels/game.entity';

import {
  IViewUpdater,
  ViewUpdaterHandler,
} from '@berniemac/event-sourcing-nestjs';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { LetterGuessedEvent } from '../Events/LetterGuessed.event';
import { Logger } from '@nestjs/common';

@ViewUpdaterHandler(LetterGuessedEvent)
export class LetterGuessedUpdater implements IViewUpdater<LetterGuessedEvent> {
  constructor(
    @InjectRepository(GameProjection)
    private gamesProjectionRepository: Repository<GameProjection>,
  ) {}
  private logger = new Logger(LetterGuessedUpdater.name);

  async handle(event: LetterGuessedEvent) {
    this.logger.log(`event.lettersGuessed: ${event.lettersGuessed}`);
    this.gamesProjectionRepository.update(
      {
        gameId: event.id,
      },
      {
        lettersGuessed: event.lettersGuessed,
        dateModified: event.dateModified,
      },
    );
  }
}
