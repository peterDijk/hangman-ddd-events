import { Game as GameProjection } from '../../ReadModels/game.entity';

import {
  IViewUpdater,
  ViewUpdaterHandler,
} from '../../Infrastructure/EventStore/Views';
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
    const projection = await this.gamesProjectionRepository.findOne(event.id);
    await this.gamesProjectionRepository.update(
      {
        gameId: event.id,
      },
      {
        lettersGuessed: [...projection.lettersGuessed, event.letter],
        dateModified: event.dateModified,
      },
    );
  }
}
