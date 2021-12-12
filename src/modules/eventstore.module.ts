import { Module, DynamicModule, Logger } from '@nestjs/common';
import { EventSourcingOptions } from '../Hangman/Infrastructure/EventStore/Interfaces';
import { CqrsModule } from '@nestjs/cqrs';
import { EventStore } from '../Hangman/Infrastructure/EventStore/EventStore';
import { createEventSourcingProviders } from '../Hangman/Infrastructure/EventStore/Providers';
import { EventStoreEventSubscriber } from '../Hangman/Infrastructure/EventStore/Subscriber';

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

  static async forFeature({ streamPrefix: string }): Promise<DynamicModule> {
    const providers = createEventSourcingProviders();
    return {
      module: EventSourcingModule,
      imports: [CqrsModule],
      providers: providers,
      exports: providers,
    };
  }
}
