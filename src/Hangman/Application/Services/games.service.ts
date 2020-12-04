import { Injectable } from '@nestjs/common';
import { GameDto } from 'src/Hangman/Domain/AggregateRoot/GameDto';
import { CommandBus } from '@nestjs/cqrs';
import { StartNewGameCommand } from '../Commands/StartNewGame.command';

@Injectable()
export class GamesService {
  constructor(private readonly commandBus: CommandBus) {}

  async createGame(gameDto: GameDto) {
    return await this.commandBus.execute(new StartNewGameCommand(gameDto));
  }
}
