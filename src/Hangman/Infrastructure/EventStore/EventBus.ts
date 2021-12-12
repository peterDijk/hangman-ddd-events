import { Injectable } from '@nestjs/common';
import { ModuleRef } from '@nestjs/core';
import { CommandBus, EventBus } from '@nestjs/cqrs';
import { IEvent, IEventBus } from '@nestjs/cqrs/dist/interfaces';
import { EventStore } from './EventStore';
import { StorableEvent } from './Interfaces';
import { EventStoreEventSubscriber } from './Subscriber';

@Injectable()
export class StoreEventBus extends EventBus implements IEventBus {
  constructor(
    commandBus: CommandBus,
    moduleRef: ModuleRef,
    private readonly eventStore: EventStore,
    private readonly event$: EventBus,
  ) {
    super(commandBus, moduleRef);
  }

  onModuleInit() {
    const subscriber = new EventStoreEventSubscriber(this.eventStore);
    subscriber.connect();
    subscriber.bridgeEventsTo(this.event$.subject$);
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
    // what does this do?
    (events || []).forEach((event) => this.publish(event));
  }
}
