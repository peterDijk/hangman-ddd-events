import { Injectable } from '@nestjs/common';
import { Game } from '../AggregateRoot/Game.aggregate';

@Injectable()
export class GamesRepository {
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
