import { Game as GameProjection } from '../../projections/game.entity';

import { NewGameStartedEvent } from '../impl/new-game-started.event';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Logger } from '@nestjs/common';
import {
  IViewUpdater,
  ViewUpdaterHandler,
} from '@peterdijk/nestjs-eventstoredb';

@ViewUpdaterHandler(NewGameStartedEvent)
export class NewGameStartedUpdater
  implements IViewUpdater<NewGameStartedEvent> {
  constructor(
    @InjectRepository(GameProjection)
    private gamesProjectionRepository: Repository<GameProjection>,
  ) {}

  private logger = new Logger(NewGameStartedUpdater.name);

  async handle(event: NewGameStartedEvent) {
    const game = this.gamesProjectionRepository.create({
      ...event,
      gameId: event.id,
      playerId: event.playerId,
      wordToGuess: event.wordToGuess,
      playerName: '',
      dateCreated: event.dateCreated,
      dateModified: event.dateModified,
      lettersGuessed: [],
    });

    await game.save();
  }
}
