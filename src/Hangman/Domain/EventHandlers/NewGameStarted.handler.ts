import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { NewGameStartedEvent } from '../Events/NewGameStarted.event';
import { Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Game as GameProjection } from '../../ReadModels/game.entity';
import { Repository } from 'typeorm';

@EventsHandler(NewGameStartedEvent)
export class NewGameStartedEventHandler
  implements IEventHandler<NewGameStartedEvent> {
  constructor(
    @InjectRepository(GameProjection)
    private gamesProjectionRepository: Repository<GameProjection>,
  ) {}
  private readonly logger = new Logger(NewGameStartedEventHandler.name);

  async handle(event: NewGameStartedEvent) {
    this.logger.log(event);

    try {
      this.logger.log(`Adding projection, ${JSON.stringify(event)}`);

      // when gameId is as second argument in the event, its not
      // manipulated on importing. Now the first argument is "game": "game"
      // it stays unchanged
      // const newGame = this.gamesProjectionRepository.create({
      //   gameId: event.gameId,
      //   playerId: event.playerId,
      //   playerName: '',
      //   wordToGuess: event.wordToGuess,
      //   maxGuesses: event.maxGuesses,
      // });
      // await this.gamesProjectionRepository.save(newGame);
    } catch (err) {
      this.logger.log('cant save to projection');
    }
  }
}
