import { Injectable } from '@nestjs/common';
import { ModuleRef } from '@nestjs/core';
import { CommandBus, EventBus } from '@nestjs/cqrs';
import { IEvent, IEventBus } from '@nestjs/cqrs/dist/interfaces';
import { EventStore } from './EventStore';
import { EventSerializers, StorableEvent } from './Interfaces';
import { EventStoreEventSubscriber } from './Subscriber';
import { ViewEventBus } from './Views';

@Injectable()
export class StoreEventBus extends EventBus implements IEventBus {
  public streamPrefix: string;
  public eventSerializers: EventSerializers;

  constructor(
    commandBus: CommandBus,
    moduleRef: ModuleRef,
    private readonly eventStore: EventStore,
    private readonly event$: EventBus,
    private readonly viewEventsBus: ViewEventBus,
    streamPrefix: string,
    eventSerializers: EventSerializers,
  ) {
    super(commandBus, moduleRef);
    this.streamPrefix = streamPrefix;
    this.eventSerializers = eventSerializers;
  }

  async onModuleInit() {
    this.eventStore.setSerializers(this.streamPrefix, this.eventSerializers);
    const subscriber = new EventStoreEventSubscriber(
      this.eventStore,
      this.viewEventsBus,
      this.streamPrefix,
    );
    subscriber.bridgeEventsTo(this.event$.subject$);
    await subscriber.getAll(); // from checkpoint xxx comes later
    subscriber.subscribe();
  }

  publish<T extends IEvent>(event: T): void {
    const storableEvent = (event as any) as StorableEvent;
    if (
      storableEvent.id === undefined ||
      storableEvent.eventVersion === undefined
    ) {
      throw new Error('Events must implement StorableEvent interface');
    }
    this.eventStore.storeEvent(storableEvent, this.streamPrefix);
  }

  publishAll(events: IEvent[]): void {
    (events || []).forEach((event) => this.publish(event));
  }
}
