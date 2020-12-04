import { AggregateRoot } from '@nestjs/cqrs';
import { NewGameStartedEvent } from '../Events/NewGameStarted.event';
import { GameDto } from './GameDto';

export class Game extends AggregateRoot {
  data: GameDto; // interface?

  constructor(private readonly gameId: string | undefined) {
    super();
  }

  setData(data: GameDto) {
    this.data = data;
  }

  startGame() {
    this.apply(new NewGameStartedEvent(this.data));
  }
}
