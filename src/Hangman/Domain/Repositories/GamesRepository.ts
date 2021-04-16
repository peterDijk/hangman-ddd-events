import { Injectable } from '@nestjs/common';
import { GameDto } from 'src/Hangman/Infrastructure/Dto/Game.dto';
import { Game } from '../AggregateRoot/Game.aggregate';

@Injectable()
export class GamesRepository {
  async startNewGame(data: GameDto) {
    const game = new Game(data);
    await game.startNewGame();
    return game;
  }
}
