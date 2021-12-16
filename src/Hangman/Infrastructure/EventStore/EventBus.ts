import { Injectable } from '@nestjs/common';
import { ModuleRef } from '@nestjs/core';
import { CommandBus, EventBus } from '@nestjs/cqrs';
import { IEvent, IEventBus } from '@nestjs/cqrs/dist/interfaces';
import { EventStore } from './EventStore';
import { StorableEvent } from './Interfaces';
import { EventStoreEventSubscriber } from './Subscriber';
import { ViewEventBus } from './Views/View-Eventbus';

@Injectable()
export class StoreEventBus extends EventBus implements IEventBus {
  constructor(
    // streamPrefix: string,
    commandBus: CommandBus,
    moduleRef: ModuleRef,
    private readonly eventStore: EventStore,
    private readonly event$: EventBus,
    private readonly viewEventBus: ViewEventBus,
  ) {
    super(commandBus, moduleRef);
  }

  onModuleInit(...args) {
    console.log(args);
    const subscriber = new EventStoreEventSubscriber(this.eventStore);
    subscriber.bridgeEventsTo(this.event$.subject$);
    subscriber.subscribe('game');
  }

  publish<T extends IEvent>(event: T): void {
    console.log('publish eventbus');

    const storableEvent = (event as any) as StorableEvent;
    if (
      storableEvent.id === undefined ||
      storableEvent.eventAggregate === undefined ||
      storableEvent.eventVersion === undefined
    ) {
      throw new Error('Events must implement StorableEvent interface');
    }

    this.eventStore.storeEvent(storableEvent);
    console.log('calling view-eventbus');
    this.viewEventBus.publish(event);
  }

  publishAll(events: IEvent[]): void {
    // what does this do?
    (events || []).forEach((event) => this.publish(event));
  }
}
