import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import {
  EventStoreModule,
  EventStoreSubscriptionType,
} from '@juicycleff/nestjs-event-store';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GamesController } from '../controllers/game.controller';
import { GamesService } from '../Hangman/Application/Services/games.service';
import { GamesRepository } from '../Hangman/Domain/Repositories/GamesRepository';
import { NewGameStartedEvent } from '../Hangman/Domain/Events/NewGameStarted.event';
import CommandHandlers from '../Hangman/Application/CommandHandlers';
import EventHandlers from '../Hangman/Domain/EventHandlers';
import { GamesResolver } from '../resolvers/game.resolver';
import { Game as GameProjection } from '../Hangman/ReadModels/game.entity';

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
          resolveLinkTos: true, // Default is true (Optional)
          lastCheckpoint: null,
          //fetches from the start. in follow-up PR, store the position somewhere, and setup a configservice that can read this position and insert it here
        },
      ],
      eventHandlers: {
        NewGameStartedEvent: (gameId, playerId, wordToGuess, maxGuesses) => {
          return new NewGameStartedEvent(
            gameId,
            playerId,
            wordToGuess,
            maxGuesses,
          );
        }, // dit wordt dus een lang handmatig aangevulde lijst als je heel veel soorten events hebt?? onhandig?
      },
    }),
    TypeOrmModule.forFeature([GameProjection]),
  ],
  controllers: [GamesController],
  providers: [
    GamesResolver,
    GamesService,
    GamesRepository,
    ...CommandHandlers,
    ...EventHandlers,
  ],
})
export class GamesModule {}
