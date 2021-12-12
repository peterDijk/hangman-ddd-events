import { Module, DynamicModule, OnModuleInit, Logger } from '@nestjs/common';
import { EventSourcingOptions } from '../Hangman/Infrastructure/EventStore/Interfaces';
import { CqrsModule, EventBus } from '@nestjs/cqrs';
import { EventStore } from '../Hangman/Infrastructure/EventStore/EventStore';
import { createEventSourcingProviders } from '../Hangman/Infrastructure/EventStore/Providers';
import { EventStoreEventSubscriber } from '../Hangman/Infrastructure/EventStore/Subscriber';

@Module({
  imports: [CqrsModule],
  providers: [EventStoreEventSubscriber],
})
export class EventSourcingModule implements OnModuleInit {
  // private _eventBus: EventBus;
  // private _subscriber: EventStoreEventSubscriber;

  private logger = new Logger(EventSourcingModule.name);

  constructor(
    private readonly event$: EventBus,
    private readonly subscriber: EventStoreEventSubscriber,
  ) {
    // this._eventBus = event$;
    // this._subscriber = subscriber;
  }

  async onModuleInit() {
    this.logger.log('onModuleInit');

    // await this.subscriber.connect();
    // this.subscriber.bridgeEventsTo(this.event$.subject$);
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

  static async forFeature({ streamPrefix: string }): Promise<DynamicModule> {
    // await this._subscriber.connect();
    // this.subscriber.bridgeEventsTo(this.event$.subject$);
    const providers = createEventSourcingProviders();
    return {
      module: EventSourcingModule,
      imports: [CqrsModule],
      providers: providers,
      exports: providers,
    };
  }
}
