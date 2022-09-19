import {
  IViewUpdater,
  ViewUpdaterHandler,
} from '@peterdijk/nestjs-eventstoredb';
import { Game as GameProjection } from '../../ReadModels/game.entity';

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
    /* is it ok the aggregate is not used here at all ??
     * now we dont care about any aggregate logic at all,
     * we just assume it's allright because the event got
     * stored so it must have passed validation, so we just
     * update the projection
     *
     */
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
