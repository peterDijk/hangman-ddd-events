import { Game as GameProjection } from '../../ReadModels/game.entity';

import {
  IViewUpdater,
  ViewUpdaterHandler,
} from '@berniemac/event-sourcing-nestjs';
import { NewGameStartedEvent } from '../Events/NewGameStarted.event';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@ViewUpdaterHandler(NewGameStartedEvent)
export class NewGameStartedUpdater
  implements IViewUpdater<NewGameStartedEvent> {
  constructor(
    @InjectRepository(GameProjection)
    private gamesProjectionRepository: Repository<GameProjection>,
  ) {}

  async handle(event: NewGameStartedEvent) {
    const game = this.gamesProjectionRepository.create({
      ...event,
      gameId: event.id,
      playerId: event.playerId,
      wordToGuess: event.wordToGuess,
      playerName: '',
    });
    game.save();
  }
}
