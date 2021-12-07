import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { NewGameStartedEvent } from '../Events/NewGameStarted.event';
import { Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Game as GameProjection } from '../../ReadModels/game.entity';
import { Repository } from 'typeorm';
import { LetterGuessedEvent } from '../Events/LetterGuessed.event';

@EventsHandler(LetterGuessedEvent)
export class LetterGuessedEventHandler
  implements IEventHandler<LetterGuessedEvent> {
  constructor(
    @InjectRepository(GameProjection)
    private gamesProjectionRepository: Repository<GameProjection>,
  ) {}
  private readonly logger = new Logger(LetterGuessedEventHandler.name);

  async handle(event: LetterGuessedEvent) {
    try {
      this.logger.log(`Updating projection, ${JSON.stringify(event)}`);

      await this.gamesProjectionRepository.update(
        {
          gameId: event.gameId,
        },
        { lettersGuessed: event.lettersGuessed },
      );
    } catch (err) {
      this.logger.log('cant save to projection');
    }
  }
}
