import { Injectable } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { GameDto } from 'src/Hangman/Infrastructure/Dto/Game.dto';
import { StartNewGameCommand } from '../Commands/StartNewGame.command';

@Injectable()
export class GamesService {
  constructor(private readonly commandBus: CommandBus) {}

  async startNewGame(data: GameDto) {
    return await this.commandBus.execute(new StartNewGameCommand(data));
  }

  async getAllGames() {
    return await []; // get records from schema-less db
  }
}
