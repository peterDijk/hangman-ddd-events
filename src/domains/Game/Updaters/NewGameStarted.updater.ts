import { Game as GameProjection } from '../../../infrastructure/read-models/game.entity';

import { NewGameStartedEvent } from '../Events/NewGameStarted.event';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Injectable, Logger, Scope } from '@nestjs/common';
import {
  IViewUpdater,
  ViewUpdaterHandler,
} from '@peterdijk/nestjs-eventstoredb';
import { UserRepository } from '../../../domains/User/User.repository';

@ViewUpdaterHandler(NewGameStartedEvent)
export class NewGameStartedUpdater
  implements IViewUpdater<NewGameStartedEvent>
{
  constructor(
    @InjectRepository(GameProjection)
    private gamesProjectionRepository: Repository<GameProjection>,
    private userRepository: UserRepository,
  ) {}

  private logger = new Logger(NewGameStartedUpdater.name);

  async handle(event: NewGameStartedEvent) {
    try {
      const player = await this.userRepository.findOneById(event.playerId);

      const game = this.gamesProjectionRepository.create({
        ...event,
        gameId: event.id,
        playerId: event.playerId,
        wordToGuess: event.wordToGuess,
        playerName: player.fullName.value,
        dateCreated: new Date(event.dateCreated),
        dateModified: new Date(event.dateModified),
        lettersGuessed: [],
        maxGuesses: event.maxGuesses,
      });
      await game.save();
    } catch (err) {
      this.logger.error(err);
    }
  }
}
