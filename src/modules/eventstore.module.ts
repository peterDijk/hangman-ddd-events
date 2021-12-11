import { Module, DynamicModule } from '@nestjs/common';
import { EventSourcingOptions } from '../Hangman/Infrastructure/EventStore/Interfaces';
import { CqrsModule } from '@nestjs/cqrs';
import { EventStore } from '../Hangman/Infrastructure/EventStore/EventStore';
import { createEventSourcingProviders } from '../Hangman/Infrastructure/EventStore/Providers';

@Module({})
export class EventSourcingModule {
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

  static forFeature(): DynamicModule {
    const providers = createEventSourcingProviders();
    return {
      module: EventSourcingModule,
      imports: [CqrsModule],
      providers: providers,
      exports: providers,
    };
  }
}
