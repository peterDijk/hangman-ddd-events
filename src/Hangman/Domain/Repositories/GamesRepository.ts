import { Injectable } from '@nestjs/common';
import { Game } from '../AggregateRoot/Game.aggregate';

@Injectable()
export class GamesRepository {
  // repository heeft niks in zich, geen state. alleen het taakje 'maak nieuw aggregate, set data, start game (laatste stap is apply event op aggregate)
  async startNewGame(
    gameId: string,
    playerId: string,
    wordToGuess: string,
    maxGuesses: number,
  ) {
    const game = new Game(gameId, playerId, wordToGuess, maxGuesses);
    await game.startNewGame();
    return game;
  }
}
