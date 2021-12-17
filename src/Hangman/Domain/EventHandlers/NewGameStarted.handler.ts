import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { NewGameStartedEvent } from '../Events/NewGameStarted.event';
import { Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Game as GameProjection } from '../../ReadModels/game.entity';
import { Repository } from 'typeorm';
import { NewGameStartedUpdater } from '../Updaters/NewGameStarted.updater';

@EventsHandler(NewGameStartedEvent)
export class NewGameStartedEventHandler
  implements IEventHandler<NewGameStartedEvent> {
  constructor(
    @InjectRepository(GameProjection)
    private gamesProjectionRepository: Repository<GameProjection>,
    private readonly viewUpdater: NewGameStartedUpdater,
  ) {}
  private readonly logger = new Logger(NewGameStartedEventHandler.name);

  async handle(event: NewGameStartedEvent) {
    try {
      await this.viewUpdater.handle(event);
      // send websocket
      this.logger.log(`${JSON.stringify(event)}`);
    } catch (err) {
      this.logger.error(`cant save to projection: ${err}`);
    }
  }
}
