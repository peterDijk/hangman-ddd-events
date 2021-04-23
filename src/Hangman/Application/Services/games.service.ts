import { Injectable, Logger } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { ApiResponse } from 'src/Hangman/Infrastructure/Dto/Api.dto';
import { GameDto } from 'src/Hangman/Infrastructure/Dto/Game.dto';
import { StartNewGameCommand } from '../Commands/StartNewGame.command';

@Injectable()
export class GamesService {
  constructor(private readonly commandBus: CommandBus) {}
  private readonly logger = new Logger(GamesService.name);

  async startNewGame(data: GameDto) {
    try {
      await this.commandBus.execute(new StartNewGameCommand(data));

      return { message: 'success', status: 201 };
    } catch (err) {
      this.logger.error(err.name, err.stack);
      // throw new BadRequestException("Can't start a new game");
      return {
        message: 'error creating',
        status: 400,
        error: err.name,
      };
    }
  }

  async getAllGames() {
    return await []; // get records from schema-less db
  }
}
