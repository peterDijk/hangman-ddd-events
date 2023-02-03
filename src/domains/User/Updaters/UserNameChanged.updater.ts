import { User as UserProjection } from '../../../infrastructure/read-models/user.entity';
import { Game as GameProjection } from '../../../infrastructure/read-models/game.entity';

import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Logger } from '@nestjs/common';
import {
  IViewUpdater,
  ViewUpdaterHandler,
} from '@peterdijk/nestjs-eventstoredb';
import { UserNameChangedEvent } from '../Events/UserNameChanged.event';

@ViewUpdaterHandler(UserNameChangedEvent)
export class UserNameChangedUpdater
  implements IViewUpdater<UserNameChangedEvent>
{
  constructor(
    @InjectRepository(UserProjection)
    private userProjectionRepository: Repository<UserProjection>,
    @InjectRepository(GameProjection)
    private gameProjectionRepository: Repository<GameProjection>,
  ) {}

  private logger = new Logger(UserNameChangedUpdater.name);

  async handle(event: UserNameChangedEvent) {
    try {
      await this.userProjectionRepository.update(
        {
          userId: event.id,
        },
        {
          username: event.newUserName,
        },
      );

      await this.gameProjectionRepository.update(
        {
          playerId: event.id,
        },
        {
          playerName: event.newUserName,
        },
      );
    } catch (err) {
      this.logger.error(err);
    }
  }
}
