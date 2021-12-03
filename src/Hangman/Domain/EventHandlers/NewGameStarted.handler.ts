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
    const existingGame = await this.gamesProjectionRepository.findOne({
      gameId: event.gameId,
    });
    if (existingGame) {
      this.logger.log(`Already exists, ${JSON.stringify(existingGame)}`);
      return;
    }
    /*
     * is querying the projection for every event too expensive on performance?
     *
     * should command handler check if the new game is allowed to be created?
     * for that the command handler has to access read side - not good?
     * should be possible somehow to check current state of system in handler to
     * see if the action is allowed. Or go happy path, assume its all ok in
     * command, then if in event handler seems it can't be done, emit event like
     * 'creating failed, not allowed'
     */
    this.logger.log(`Adding projection, ${JSON.stringify(event)}`);

    const newGame = this.gamesProjectionRepository.create({
      gameId: event.gameId,
      playerId: event.playerId,
      playerName: '',
      wordToGuess: event.wordToGuess,
      maxGuesses: event.maxGuesses,
    });
    await this.gamesProjectionRepository.save(newGame);
  }
}
