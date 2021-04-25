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
    // write to projection database?

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
