import { User as UserProjection } from '../../../infrastructure/read-models/user.entity';

import { NewGameStartedEvent } from '../../Game/Events/NewGameStarted.event';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Logger } from '@nestjs/common';
import {
  IViewUpdater,
  ViewUpdaterHandler,
} from '@peterdijk/nestjs-eventstoredb';
import { UserCreatedEvent } from '../Events/UserCreated.event';

@ViewUpdaterHandler(UserCreatedEvent)
export class UserCreatedUpdater implements IViewUpdater<UserCreatedEvent> {
  constructor(
    @InjectRepository(UserProjection)
    private userProjectionRepository: Repository<UserProjection>,
  ) {}

  private logger = new Logger(UserCreatedUpdater.name);

  async handle(event: UserCreatedEvent) {
    try {
      console.log(event);
      const user = this.userProjectionRepository.create({
        ...event,
        userId: event.id,
        username: event.userName,
        password: event.password,
        dateCreated: new Date(event.dateCreated),
        dateModified: new Date(event.dateModified),
      });
      await user.save();
    } catch (err) {
      this.logger.error(err);
    }
  }
}
