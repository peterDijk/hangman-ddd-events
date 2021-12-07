import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { GameDto } from '../../Infrastructure/Dto/Game.dto';
import { StartNewGameCommand } from '../Commands/StartNewGame.command';
import { Game as GameProjection } from '../../ReadModels/game.entity';
import { v4 as uuidv4 } from 'uuid';
import { GuessLetterCommand } from '../Commands/GuessLetter.command';

@Injectable()
export class GamesService {
  constructor(
    private readonly commandBus: CommandBus,
    @InjectRepository(GameProjection)
    private gamesProjectionRepository: Repository<GameProjection>,
  ) {}
  private readonly logger = new Logger(GamesService.name);

  async startNewGame(data: GameDto) {
    console.log(data.gameId);

    const gameId = uuidv4();

    try {
      await this.commandBus.execute(new StartNewGameCommand(data, gameId));

      this.logger.log(`New game started; ${gameId}`);
      return { message: 'success', status: 201, gameId, data };
    } catch (err) {
      this.logger.error(err.name, err.stack);

      throw new BadRequestException("Can't start a new game");
    }
  }

  async getAllGames(): Promise<{ count: number; games: GameProjection[] }> {
    this.logger.log('getAllGames');
    const games = await this.gamesProjectionRepository.find();
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

      throw new BadRequestException('Cant make guess');
    }
  }
}
