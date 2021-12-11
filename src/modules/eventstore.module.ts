import { Module, DynamicModule, OnModuleInit } from '@nestjs/common';
import { EventSourcingOptions } from '../Hangman/Infrastructure/EventStore/Interfaces';
import { CqrsModule, EventBus } from '@nestjs/cqrs';
import { EventStoreEventSubscriber } from '../Hangman/Infrastructure/EventStore/Subscriber';
import { EventStoreEventPublisher } from '../Hangman/Infrastructure/EventStore/Publisher';
import { EventStore } from '../Hangman/Infrastructure/EventStore/EventStore';

@Module({
  imports: [CqrsModule],
  providers: [EventStoreEventSubscriber, EventStoreEventPublisher],
})
export class EventSourcingModule implements OnModuleInit {
  constructor(
    private readonly event$: EventBus,
    private readonly subscriber: EventStoreEventSubscriber,
    private readonly publisher: EventStoreEventPublisher,
  ) {}

  async onModuleInit() {
    await this.subscriber.connect();
    this.subscriber.bridgeEventsTo(this.event$.subject$);
    this.publisher.connect();
    this.event$.publisher = this.publisher;
  }

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

  static forFeature({ streamPrefix: string }): DynamicModule {
    // const providers = createEventSourcingProviders();
    return {
      module: EventSourcingModule,
      imports: [CqrsModule],
      providers: [EventStoreEventSubscriber, EventStoreEventPublisher],
      exports: [EventStoreEventSubscriber, EventStoreEventPublisher],
    };
  }
}
