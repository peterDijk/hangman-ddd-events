import { Injectable } from '@nestjs/common';
import { Game } from '../AggregateRoot/Game.aggregate';

@Injectable()
export class GamesRepository {
  async startNewGame(
    playerId: string,
    wordToGuess: string,
    maxGuesses: number,
  ) {
    const game = new Game(playerId, wordToGuess, maxGuesses);
    await game.startNewGame();
    return game;
  }
}
