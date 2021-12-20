import { Module, DynamicModule, Logger } from '@nestjs/common';
import { EventSourcingOptions } from '../Hangman/Infrastructure/EventStore/Interfaces';
import { CommandBus, CqrsModule, EventBus } from '@nestjs/cqrs';
import { EventStore } from '../Hangman/Infrastructure/EventStore/EventStore';
import { createEventSourcingProviders } from '../Hangman/Infrastructure/EventStore/Providers';
import { EventStoreEventSubscriber } from '../Hangman/Infrastructure/EventStore/Subscriber';
import {
  ViewEventBus,
  ViewUpdater,
} from '../Hangman/Infrastructure/EventStore/Views';
import { StoreEventBus } from '../Hangman/Infrastructure/EventStore/EventBus';
import { StoreEventPublisher } from '../Hangman/Infrastructure/EventStore/Publisher';
import { ModuleRef } from '@nestjs/core';
import { View } from 'typeorm/schema-builder/view/View';

@Module({
  imports: [CqrsModule],
  providers: [EventStoreEventSubscriber],
})
export class EventSourcingModule {
  private logger = new Logger(EventSourcingModule.name);

  static forRoot(options: EventSourcingOptions): DynamicModule {
    return {
      module: EventSourcingModule,
      providers: [
        {
          provide: EventStore,
          useValue: new EventStore(options),
        },
      ],
      exports: [EventStore],
      global: true,
    };
  }

  static async forFeature(options: {
    streamPrefix: string;
  }): Promise<DynamicModule> {
    return {
      module: EventSourcingModule,
      imports: [CqrsModule],
      providers: [
        ViewUpdater,
        ViewEventBus,
        {
          provide: StoreEventBus,
          useFactory: (
            commandBus: CommandBus,
            moduleRef: ModuleRef,
            eventStore: EventStore,
            event$: EventBus,
            viewEventsBus: ViewEventBus,
          ) => {
            return new StoreEventBus(
              commandBus,
              moduleRef,
              eventStore,
              event$,
              viewEventsBus,
              options.streamPrefix,
            );
          },
          inject: [CommandBus, ModuleRef, EventStore, EventBus, ViewEventBus],
        },
        StoreEventPublisher,
      ],
      exports: [ViewUpdater, ViewEventBus, StoreEventBus, StoreEventPublisher],
    };
  }
}
