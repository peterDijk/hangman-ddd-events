import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { v4 as uuidv4 } from 'uuid';

import { GameDto } from './interfaces/game-dto.interface';
import { StartNewGameCommand } from './commands/impl/start-new-game.command';
import { GuessLetterCommand } from './commands/impl/guess-letter.command';
import { Game as GameProjection } from './projections/game.entity';

@Injectable()
export class GamesService {
  constructor(
    private readonly commandBus: CommandBus,
    @InjectRepository(GameProjection)
    private gamesProjectionRepository: Repository<GameProjection>,
  ) {}
  private readonly logger = new Logger(GamesService.name);

  async startNewGame(data: GameDto) {
    const gameId = uuidv4();

    await this.commandBus.execute(new StartNewGameCommand(gameId, data));
    try {
      this.logger.log(`New game started; ${gameId}`);
      return { message: 'success', status: 201, gameId, data };
    } catch (err) {
      this.logger.log(err);
      this.logger.error(err.name, err.stack);
      throw new BadRequestException(err);
    }
  }

  async getAllGames(): Promise<{ count: number; games: GameProjection[] }> {
    this.logger.log('getAllGames');
    const games = await this.gamesProjectionRepository.find({
      order: { dateModified: 'DESC' },
    });
    return {
      count: games.length,
      games,
    };
  }

  async makeGuess(gameId: string, letter: string) {
    try {
      await this.commandBus.execute(new GuessLetterCommand(gameId, letter));

      return { message: 'success', status: 200, gameId, letter };
    } catch (err) {
      this.logger.error(err.name, err.stack);

      throw new BadRequestException(err, 'Cant make guess');
    }
  }
}
