import { Injectable } from '@nestjs/common';
import { GameDto } from '../../Infrastructure/Dto/Game.dto';
import { Game } from '../AggregateRoot/Game.aggregate';

@Injectable()
export class GamesRepository {
  async startNewGame(data: GameDto, uuid: string) {
    const game = new Game(data, uuid);
    await game.startNewGame();
    return game;
  }
}
