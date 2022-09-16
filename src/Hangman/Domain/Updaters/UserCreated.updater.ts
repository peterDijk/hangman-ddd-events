import { User as UserProjection } from '../../ReadModels/user.entity';

import { NewGameStartedEvent } from '../Events/NewGameStarted.event';
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
    this.logger.debug(JSON.stringify(event));
    const user = this.userProjectionRepository.create({
      ...event,
      userId: event.id,
      username: event.userName,
      password: event.password,
    });

    await user.save();
  }
}