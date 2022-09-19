import { ICommand } from '@nestjs/cqrs';
import { GameDto } from '../../../infrastructure/dto/Game.dto';

export class StartNewGameCommand implements ICommand {
  constructor(public data: GameDto, public uuid: string) {}
}
