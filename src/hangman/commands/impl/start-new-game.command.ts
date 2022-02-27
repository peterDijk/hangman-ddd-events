import { ICommand } from '@nestjs/cqrs';
import { GameDto } from '../../interfaces/game-dto.interface';

export class StartNewGameCommand implements ICommand {
  constructor(public data: GameDto, public uuid: string) {}
}
