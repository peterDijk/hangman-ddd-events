import { Game as GameProjection } from '../../../infrastructure/read-models/game.entity';

import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Logger } from '@nestjs/common';
import {
  IViewUpdater,
  ViewUpdaterHandler,
} from '@peterdijk/nestjs-eventstoredb';
import { FullNameChangedEvent } from '../../User/Events/FullNameChanged.event';

@ViewUpdaterHandler(FullNameChangedEvent)
export class UserFullNameChangedUpdater
  implements IViewUpdater<FullNameChangedEvent>
{
  constructor(
    @InjectRepository(GameProjection)
    private gameProjectionRepository: Repository<GameProjection>,
  ) {}

  private logger = new Logger(UserFullNameChangedUpdater.name);

  async handle(event: FullNameChangedEvent) {
    try {
      await this.gameProjectionRepository.update(
        {
          playerId: event.id,
        },
        {
          playerName: event.newFullName,
        },
      );
    } catch (err) {
      this.logger.error(err);
    }
  }
}
