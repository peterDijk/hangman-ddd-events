import {
  IViewUpdater,
  ViewUpdaterHandler,
} from '@peterdijk/nestjs-eventstoredb';
import { Game as GameProjection } from '../../../infrastructure/read-models/game.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { LetterGuessedEvent } from '../Events/LetterGuessed.event';
import { Logger } from '@nestjs/common';
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
    try {
      // const game: Game = await this.gamesRepository.findOneById(event.id);

      // if (game.id === '3b5ae88a-1aa4-47e3-be99-6187963e488c') {
      // console.log(game.lettersGuessed);

      // const guessFlatArray = game.lettersGuessed.value.map(
      //   (letter) => letter.value,
      // );
      // console.log({ guessFlatArray });
      // }

      console.log({ event });

      await this.gamesProjectionRepository.update(
        {
          gameId: event.id,
        },
        {
          lettersGuessed: ['g'],
          // dateModified: new Date(event.dateModified),
        },
      );
    } catch (error) {
      throw new Error(error);
    }
  }
}
