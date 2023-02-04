import {
  IViewUpdater,
  ViewUpdaterHandler,
} from '@peterdijk/nestjs-eventstoredb';
import { Game as GameProjection } from '../../../infrastructure/read-models/game.entity';

import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { LetterGuessedEvent } from '../Events/LetterGuessed.event';
import { Injectable, Logger } from '@nestjs/common';
import { Game } from '../Game.aggregate';
import { GamesRepository } from '../Games.repository';

@ViewUpdaterHandler(LetterGuessedEvent)
export class LetterGuessedUpdater implements IViewUpdater<LetterGuessedEvent> {
  constructor(
    @InjectRepository(GameProjection)
    private gamesProjectionRepository: Repository<GameProjection>,
    private readonly gamesRepository: GamesRepository,
  ) {}
  private logger = new Logger(LetterGuessedUpdater.name);

  async handle(event: LetterGuessedEvent) {
    // deze functie kan rustig in de achtergrond
    // async zwaardere dingen doen en met delay
    // de projectie updaten, is niet erg
    const game: Game = await this.gamesRepository.findOneById(event.id);
    // const projection = await this.gamesProjectionRepository.findOne({
    //   where: { gameId: event.id },
    // });
    await this.gamesProjectionRepository.update(
      {
        gameId: event.id,
      },
      {
        // should this not be using the actual Game for source?
        lettersGuessed: game.lettersGuessed.value.map((letter) => letter.value),
        // lettersGuessed: [...projection.lettersGuessed, event.letter],
        dateModified: event.dateModified,
      },
    );
  }
}
