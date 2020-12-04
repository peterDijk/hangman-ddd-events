import { ICommand } from '@nestjs/cqrs';
import { GameDto } from 'src/Hangman/Domain/AggregateRoot/GameDto';

export class StartNewGameCommand implements ICommand {
  constructor(public readonly gameDto: GameDto) {}
}
