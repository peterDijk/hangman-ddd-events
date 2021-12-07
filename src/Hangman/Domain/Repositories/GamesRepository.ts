import { Injectable } from '@nestjs/common';
import { GameDto } from '../../Infrastructure/Dto/Game.dto';
import { Game } from '../AggregateRoot/Game.aggregate';

@Injectable()
export class GamesRepository {
  // wordt dit niet gigantisch in memory?
  // database in memory?
  private aggregates: { [aggregateId: string]: Game } = {};

  async findOneById(aggregateId: string): Promise<Game> {
    return Promise.resolve(this.aggregates[aggregateId]);
  }

  async save(game: Game): Promise<Game> {
    this.aggregates[game.gameId] = game;
    return this.aggregates[game.gameId];
  }

  async startNewGameRep(data: GameDto, uuid: string) {
    const game = new Game(data, uuid);
    await game.startNewGame();

    this.aggregates[game.gameId] = game;

    return game;
  }

  async guessLetterRep(gameId: string, letter: string) {
    const game = await this.findOneById(gameId);
    await game.guessLetter(letter);

    return this.save(game);
  }
}
