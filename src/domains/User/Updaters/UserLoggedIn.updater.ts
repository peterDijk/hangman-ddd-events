import { User as UserProjection } from '../../../infrastructure/read-models/user.entity';

import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Logger } from '@nestjs/common';
import {
  IViewUpdater,
  ViewUpdaterHandler,
} from '@peterdijk/nestjs-eventstoredb';
import { UserLoggedInEvent } from '../Events/UserLoggedIn.event';

@ViewUpdaterHandler(UserLoggedInEvent)
export class UserLoggedInUpdater implements IViewUpdater<UserLoggedInEvent> {
  constructor(
    @InjectRepository(UserProjection)
    private userProjectionRepository: Repository<UserProjection>,
  ) {}

  private logger = new Logger(UserLoggedInUpdater.name);

  async handle(event: UserLoggedInEvent) {
    try {
      await this.userProjectionRepository.update(
        {
          userId: event.id,
        },
        {
          numberLogins: event.numberLogins,
          lastLoggedIn: event.dateLoggedIn,
          dateModified: event.dateModified,
        },
      );
    } catch (err) {
      this.logger.error(err);
    }
  }
}
