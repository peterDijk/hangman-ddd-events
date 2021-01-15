import { Module, OnModuleInit } from '@nestjs/common';
import { CqrsModule, CommandBus, EventBus } from '@nestjs/cqrs';
import {
  EventStoreModule,
  EventStore,
  EventStoreSubscriptionType,
} from '@juicycleff/nestjs-event-store';

import { GamesController } from 'src/controllers/game.controller';
import { GamesService } from 'src/Hangman/Application/Services/games.service';
import { GamesRepository } from 'src/Hangman/Domain/Repositories/GamesRepository';
import { StartNewGameCommandHandler } from 'src/Hangman/Application/CommandHandlers/StartNewGame.handler';
import { NewGameStartedEventHandler } from 'src/Hangman/Domain/EventHandlers/NewGameStarted.handler';
import { NewGameStartedEvent } from 'src/Hangman/Domain/Events/NewGameStarted.event';

@Module({
  imports: [
    CqrsModule,
    EventStoreModule.registerFeature({
      featureStreamName: '$ce-game',
      type: 'event-store',
      // store: MongoStore, // Optional mongo store for persisting catchup events position for microservices to mitigate failures. Must implement IAdapterStore
      subscriptions: [
        {
          type: EventStoreSubscriptionType.CatchUp,
          stream: '$ce-game',
          resolveLinkTos: true, // Default is true (Optional)
          lastCheckpoint: 13, // Default is 0 (Optional)
        },
      ],
      eventHandlers: {
        NewGameStartedEvent: (data) => new NewGameStartedEvent(data),
      },
    }),
  ],
  controllers: [GamesController],
  providers: [
    GamesService,
    GamesRepository,
    StartNewGameCommandHandler,
    NewGameStartedEventHandler,
  ],
})
export class GamesModule {}
// export class GamesModule implements OnModuleInit {
//   constructor(
//     private readonly moduleRef: ModuleRef,
//     private readonly command$: CommandBus,
//     private readonly event$: EventBus, // private readonly eventStore: EventStore,
//   ) {}

//   onModuleInit() {
//     // this.command$(this.moduleRef);
//     // this.event$.setModuleRef(this.moduleRef);
//     /** ------------ */
//     // this.eventStore.setEventHandlers(this.eventHandlers);
//     // this.eventStore.bridgeEventsTo((this.event$ as any).subject$);
//     // this.event$.publisher = this.eventStore;
//     /** ------------ */
//     this.event$.register([NewGameStartedEventHandler]);
//     this.command$.register([StartNewGameCommandHandler]);
//     // this.event$.combineSagas([this.usersSagas.userCreated]);
//   }
// }
