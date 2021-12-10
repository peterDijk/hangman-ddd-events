import { EventStore } from '@juicycleff/nestjs-event-store';
import { Injectable, Logger } from '@nestjs/common';
import { GameDto } from '../../Infrastructure/Dto/Game.dto';
import { Game } from '../AggregateRoot/Game.aggregate';

@Injectable()
export class GamesRepository {
  constructor(private readonly eventStore: EventStore) {}
  private logger = new Logger(GamesRepository.name);

  private findOneById(id: string) {
    const startingPosition = 0;
    const game = this.eventStore.subscribeToCatchupSubscription(
      `game-${id}`,
      true,
      startingPosition,
    );
    return game;
  }
  async startNewGame(data: GameDto, uuid: string) {
    const testGame = this.findOneById(uuid);
    this.logger.log(
      `eventstoresubscribeToCatchupSubscription : ${JSON.stringify(testGame)}`,
    );

    const game = new Game(data, uuid);
    await game.startNewGame();
    return game;
  }
}
