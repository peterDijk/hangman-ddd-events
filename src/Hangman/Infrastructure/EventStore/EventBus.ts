import { Injectable } from '@nestjs/common';
import { EventBus } from '@nestjs/cqrs';
import { IEvent, IEventBus } from '@nestjs/cqrs/dist/interfaces';
import { EventStore } from './EventStore';
import { StorableEvent } from './Interfaces';
import { EventStoreEventSubscriber } from './Subscriber';
// import { ViewEventBus } from './view/view-event-bus';

@Injectable()
export class StoreEventBus implements IEventBus {
  constructor(
    // private readonly eventBus: ViewEventBus,
    private readonly event$: EventBus,
    private readonly eventStore: EventStore,
    private readonly subscriber: EventStoreEventSubscriber,
  ) {
    // this.subscriber.connect();
    // this.subscriber.bridgeEventsTo(this.event$.subject$);
  }

  publish<T extends IEvent>(event: T): void {
    const storableEvent = (event as any) as StorableEvent;
    if (
      storableEvent.id === undefined ||
      storableEvent.eventAggregate === undefined ||
      storableEvent.eventVersion === undefined
    ) {
      throw new Error('Events must implement StorableEvent interface');
    }
    this.eventStore
      .storeEvent(storableEvent)
      // .then(() => this.eventBus.publish(event))
      .catch((err) => {
        throw err;
      });
  }

  publishAll(events: IEvent[]): void {
    (events || []).forEach((event) => this.publish(event));
  }
}
