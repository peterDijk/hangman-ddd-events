import { Injectable } from '@nestjs/common';
import { GameDto } from '../AggregateRoot/GameDto';
import { Game } from '../AggregateRoot/Game.aggregate';

@Injectable()
export class GamesRepository {
  async startGame(gameDto: GameDto) {
    const game = new Game(undefined);
    game.setData(gameDto);
    game.startGame();
    return game;
  }
}
