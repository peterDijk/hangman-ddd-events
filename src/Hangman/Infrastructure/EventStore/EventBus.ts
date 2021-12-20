import { Injectable } from '@nestjs/common';
import { ModuleRef } from '@nestjs/core';
import { CommandBus, EventBus } from '@nestjs/cqrs';
import { IEvent, IEventBus } from '@nestjs/cqrs/dist/interfaces';
import { EventStore } from './EventStore';
import { StorableEvent } from './Interfaces';
import { EventStoreEventSubscriber } from './Subscriber';
import { ViewEventBus } from './Views';

@Injectable()
export class StoreEventBus extends EventBus implements IEventBus {
  public streamPrefix: string;

  constructor(
    commandBus: CommandBus,
    moduleRef: ModuleRef,
    private readonly eventStore: EventStore,
    private readonly event$: EventBus,
    private readonly viewEventsBus: ViewEventBus,
    streamPrefix: string,
  ) {
    super(commandBus, moduleRef);
    this.streamPrefix = streamPrefix;
  }

  async onModuleInit() {
    const subscriber = new EventStoreEventSubscriber(
      this.eventStore,
      this.viewEventsBus,
    );
    subscriber.bridgeEventsTo(this.event$.subject$);
    await subscriber.getAll(); // from checkpoint xxx comes later
    subscriber.subscribe(this.streamPrefix);
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

    this.eventStore.storeEvent(storableEvent);
  }

  publishAll(events: IEvent[]): void {
    // what does this do?
    (events || []).forEach((event) => this.publish(event));
  }
}
