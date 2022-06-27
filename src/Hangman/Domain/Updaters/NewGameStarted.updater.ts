import { Game as GameProjection } from '../../ReadModels/game.entity';

import { NewGameStartedEvent } from '../Events/NewGameStarted.event';
import { InjectRepository } from '@nestjs/typeorm';
import { ObjectID, Repository } from 'typeorm';
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
    let wordToGuess: string;
    let maxGuesses: number;

    wordToGuess = event.wordToGuess;
    maxGuesses = event.maxGuesses;

    if (event.eventVersion === 2) {
      // try out version with valueobjects
      // but reverted
      // event is stored in this format so account for it
      // in updater
      wordToGuess = (event.wordToGuess as any).props.value;
      maxGuesses = (event.maxGuesses as any).props.value;
    }

    this.logger.debug({ event: JSON.stringify(event), wordToGuess });

    const game = this.gamesProjectionRepository.create({
      ...event,
      gameId: event.id,
      playerId: event.playerId,
      wordToGuess,
      playerName: '',
      dateCreated: event.dateCreated,
      dateModified: event.dateModified,
      lettersGuessed: [],
      maxGuesses: maxGuesses,
    });

    await game.save();
  }
}
