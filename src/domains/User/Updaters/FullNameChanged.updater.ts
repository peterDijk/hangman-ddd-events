import { User as UserProjection } from '../../../infrastructure/read-models/user.entity';
import { Game as GameProjection } from '../../../infrastructure/read-models/game.entity';

import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Logger } from '@nestjs/common';
import {
  IViewUpdater,
  ViewUpdaterHandler,
} from '@peterdijk/nestjs-eventstoredb';
import { FullNameChangedEvent } from '../Events/FullNameChanged.event';

@ViewUpdaterHandler(FullNameChangedEvent)
export class FullNameChangedUpdater
  implements IViewUpdater<FullNameChangedEvent>
{
  constructor(
    @InjectRepository(UserProjection)
    private userProjectionRepository: Repository<UserProjection>,
    @InjectRepository(GameProjection)
    private gameProjectionRepository: Repository<GameProjection>,
  ) {}

  private logger = new Logger(FullNameChangedUpdater.name);

  async handle(event: FullNameChangedEvent) {
    try {
      this.logger.log(JSON.stringify(event));
      await this.userProjectionRepository.update(
        {
          userId: event.id,
        },
        {
          fullName: event.newFullName,
        },
      );

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
