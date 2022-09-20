import {
  IViewUpdater,
  ViewUpdaterHandler,
} from '@peterdijk/nestjs-eventstoredb';
import { Game as GameProjection } from '../../../infrastructure/read-models/game.entity';

import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { LetterGuessedEvent } from '../Events/LetterGuessed.event';
import { Injectable, Logger } from '@nestjs/common';

@Injectable()
@ViewUpdaterHandler(LetterGuessedEvent)
export class LetterGuessedUpdater implements IViewUpdater<LetterGuessedEvent> {
  constructor(
    @InjectRepository(GameProjection)
    private gamesProjectionRepository: Repository<GameProjection>,
  ) {}
  private logger = new Logger(LetterGuessedUpdater.name);

  async handle(event: LetterGuessedEvent) {
    const projection = await this.gamesProjectionRepository.findOne({
      where: { gameId: event.id },
    });
    this.logger.log('disabled update projection');
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
