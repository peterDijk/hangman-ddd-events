import { Module } from '@nestjs/common';
import { CqrsModule, CommandHandler } from '@nestjs/cqrs';
import {
  EventStoreModule,
  EventStoreSubscriptionType,
} from '@juicycleff/nestjs-event-store';

import { GamesController } from 'src/controllers/game.controller';
import { GamesService } from 'src/Hangman/Application/Services/games.service';
import { GamesRepository } from 'src/Hangman/Domain/Repositories/GamesRepository';
import { StartNewGameCommandHandler } from 'src/Hangman/Application/CommandHandlers/StartNewGame.handler';
import { NewGameStartedEventHandler } from 'src/Hangman/Domain/EventHandlers/NewGameStarted.handler';
import { NewGameStartedEvent } from 'src/Hangman/Domain/Events/NewGameStarted.event';

const EventHandlers = [NewGameStartedEventHandler];
const CommandHandlers = [StartNewGameCommandHandler];

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
          // resolveLinkTos: true, // Default is true (Optional)
          // lastCheckpoint: 13, // Default is 0 (Optional)
        },
      ],
      eventHandlers: {
        NewGameStartedEvent: (data) => new NewGameStartedEvent(data), // dit wordt dus een lang handmatig aangevulde lijst als je heel veel soorten events hebt?? onhandig?
      },
    }),
  ],
  controllers: [GamesController],
  providers: [
    GamesService,
    GamesRepository,
    ...CommandHandlers,
    ...EventHandlers,
  ],
})
export class GamesModule {}
