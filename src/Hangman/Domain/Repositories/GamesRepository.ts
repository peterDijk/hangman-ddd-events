import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { GameDto } from '../../Infrastructure/Dto/Game.dto';
import { Game } from '../AggregateRoot/Game.aggregate';

import { Game as GameProjection } from '../../ReadModels/game.entity';
import { Repository } from 'typeorm';

@Injectable()
export class GamesRepository {
  constructor(
    @InjectRepository(GameProjection)
    private gamesProjectionRepository: Repository<GameProjection>,
  ) {}
  // wordt dit niet gigantisch in memory?
  // database in memory?
  private aggregates: { [aggregateId: string]: Game } = {};
  private logger = new Logger(GamesRepository.name);

  async findOneById(aggregateId: string): Promise<GameProjection> {
    const game = await this.gamesProjectionRepository.findOne(aggregateId);
    this.logger.log(`find One ${JSON.stringify(game)}`);

    return game;

    // return Promise.resolve(this.aggregates[aggregateId]);
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
    const newGame = new Game(
      {
        playerId: game.playerId,
        wordToGuess: game.wordToGuess,
        maxGuesses: game.maxGuesses,
        lettersGuessed: game.lettersGuessed,
      },
      game.gameId,
    );
    await newGame.guessLetter(letter);
    return newGame;
    // return this.save(game);
  }
}
