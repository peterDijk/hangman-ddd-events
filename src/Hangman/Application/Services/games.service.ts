import { Injectable } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { StartNewGameCommand } from '../Commands/StartNewGame.command';

@Injectable()
export class GamesService {
  constructor(private readonly commandBus: CommandBus) {}

  async startNewGame(
    gameId: string,
    playerId: string,
    wordToGuess: string,
    maxGuesses: number,
  ) {
    return await this.commandBus.execute(
      new StartNewGameCommand(gameId, playerId, wordToGuess, maxGuesses),
    );
  }
}
