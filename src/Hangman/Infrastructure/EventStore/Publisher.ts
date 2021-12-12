import { Injectable, Logger } from '@nestjs/common';
import { IEvent, IEventPublisher } from '@nestjs/cqrs';
import { EventStore } from './EventStore';

@Injectable()
export class EventStoreEventPublisher implements IEventPublisher {
  private logger = new Logger(EventStoreEventPublisher.name);

  constructor(private readonly eventStore: EventStore) {} //

  async publish<T extends IEvent = IEvent>(event: T) {
    this.logger.log('call eventstore.storeEvent(event)');
    this.logger.log(this.eventStore);
    this.eventStore.storeEvent(event);
  }
}
