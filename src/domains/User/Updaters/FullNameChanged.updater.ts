import { User as UserProjection } from '../../../infrastructure/read-models/user.entity';

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
    } catch (err) {
      this.logger.error(err);
    }
  }
}
