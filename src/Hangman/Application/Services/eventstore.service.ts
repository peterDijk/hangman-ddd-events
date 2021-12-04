import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EventStoreState } from '../../ReadModels/eventstore-state.entity';
import { Repository } from 'typeorm';

@Injectable()
export class EventStoreStateService {
  private readonly logger = new Logger(EventStoreStateService.name);

  constructor(
    @InjectRepository(EventStoreState)
    private eventStoreStateRepository: Repository<EventStoreState>,
  ) {}
  updateCheckpoint(stream: string, position: number) {
    const updated = this.eventStoreStateRepository.update(
      { lastCheckpoint: position },
      { streamName: stream },
    );
    this.logger.log({ updated });

    return updated;
  }

  getLastCheckpoint(stream: string) {
    const last = this.eventStoreStateRepository.findOne({
      where: { streamName: stream },
    });
    this.logger.log({ last });
    return last;
  }
}
