import { IEvent } from '@nestjs/cqrs';
import { GameDto } from '../AggregateRoot/GameDto';

export class NewGameStartedEvent implements IEvent {
  constructor(public readonly gameDto: GameDto) {}
}
