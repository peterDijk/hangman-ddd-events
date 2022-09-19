import { Game as GameProjection } from '../../../infrastructure/read-models/game.entity';

import { NewGameStartedEvent } from '../Events/NewGameStarted.event';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Logger } from '@nestjs/common';
import {
  IViewUpdater,
  ViewUpdaterHandler,
} from '@peterdijk/nestjs-eventstoredb';

@ViewUpdaterHandler(NewGameStartedEvent)
export class NewGameStartedUpdater
  implements IViewUpdater<NewGameStartedEvent>
{
  constructor(
    @InjectRepository(GameProjection)
    private gamesProjectionRepository: Repository<GameProjection>,
  ) {}

  private logger = new Logger(NewGameStartedUpdater.name);

  async handle(event: NewGameStartedEvent) {
    this.logger.log('disabled update projection');
    const game = this.gamesProjectionRepository.create({
      ...event,
      gameId: event.id,
      playerId: event.playerId,
      wordToGuess: event.wordToGuess,
      playerName: '',
      dateCreated: event.dateCreated,
      dateModified: event.dateModified,
      lettersGuessed: [],
      maxGuesses: event.maxGuesses,
    });

    await game.save();
  }
}
