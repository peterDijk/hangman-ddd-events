import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { NewGameStartedEvent } from '../Events/NewGameStarted.event';
import { Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Game } from '../../ReadModels/game.entity';
import { Repository } from 'typeorm';

@EventsHandler(NewGameStartedEvent)
export class NewGameStartedEventHandler
  implements IEventHandler<NewGameStartedEvent> {
  constructor(
    @InjectRepository(Game)
    private gamesRepository: Repository<Game>,
  ) {}
  private readonly logger = new Logger(NewGameStartedEventHandler.name);

  async handle(event: NewGameStartedEvent) {
    const existingGame = await this.gamesRepository.findOne({
      gameId: event.gameId,
    });

    if (existingGame) {
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

    const newGame = await this.gamesRepository.create({
      gameId: event.gameId,
      playerId: event.playerId,
      playerName: '',
      wordToGuess: event.wordToGuess,
      maxGuesses: event.maxGuesses,
    });
    await this.gamesRepository.save(newGame);
  }
}
