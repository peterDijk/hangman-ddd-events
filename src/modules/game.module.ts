import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import {
  EventStoreModule,
  EventStoreSubscriptionType,
} from '@juicycleff/nestjs-event-store';

import { GamesController } from 'src/controllers/game.controller';
import { GamesService } from 'src/Hangman/Application/Services/games.service';
import { GamesRepository } from 'src/Hangman/Domain/Repositories/GamesRepository';
import { NewGameStartedEventHandler } from 'src/Hangman/Domain/EventHandlers/NewGameStarted.handler';
import { NewGameStartedEvent } from 'src/Hangman/Domain/Events/NewGameStarted.event';
import CommandHandlers from 'src/Hangman/Application/CommandHandlers';
import EventHandlers from 'src/Hangman/Domain/EventHandlers';

@Module({
  imports: [
    CqrsModule,
    EventStoreModule.registerFeature({
      featureStreamName: '$ce-game',
      type: 'event-store',
      subscriptions: [
        {
          type: EventStoreSubscriptionType.CatchUp, // research various types
          stream: '$ce-game',
          // resolveLinkTos: true, // Default is true (Optional)
          // lastCheckpoint: 13, // Default is 0 (Optional) why would this be set to any number?
        },
      ],
      eventHandlers: {
        NewGameStartedEvent: (gameId, playerId, wordToGuess, maxGuesses) =>
          new NewGameStartedEvent(gameId, playerId, wordToGuess, maxGuesses), // dit wordt dus een lang handmatig aangevulde lijst als je heel veel soorten events hebt?? onhandig?
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
