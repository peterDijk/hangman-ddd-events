// import { ViewUpdater } from './view';
// import { ViewEventBus } from './view';
import { ModuleRef } from '@nestjs/core';
import { CommandBus, EventBus } from '@nestjs/cqrs';
import { StoreEventBus } from './EventBus';
import { EventStore } from './EventStore';
import { StoreEventPublisher } from './Publisher';
import { EventStoreEventSubscriber } from './Subscriber';

export function createEventSourcingProviders(streamPrefix?: string) {
  return [
    // ViewUpdater,
    // ViewEventBus,
    StoreEventBus,
    // {
    //   provide: 'CONNECTION',
    //   useFactory: (
    //     streamPrefix: string,
    //     commandBus: CommandBus,
    //     moduleRef: ModuleRef,
    //     eventStore: EventStore,
    //     event$: EventBus,
    //   ) => {
    //     return new StoreEventBus(
    //       streamPrefix,
    //       commandBus,
    //       moduleRef,
    //       eventStore,
    //       event$,
    //     );
    //   },
    //   inject: [StoreEventBus],
    // },
    StoreEventPublisher,
  ];
}
