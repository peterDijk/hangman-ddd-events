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
import CommandHandlers from '../Hangman/Application/CommandHandlers';
import EventHandlers from '../Hangman/Domain/EventHandlers';
import { GamesResolver } from '../resolvers/game.resolver';
import { Game as GameProjection } from '../Hangman/ReadModels/game.entity';
import { EventStoreInstanciators } from '../event-store';
import { connect } from '../mongo/database';
import { MongoStore } from '../mongo/mongo-eventstore-adapter';

@Module({
  imports: [
    CqrsModule,
    EventStoreModule.registerFeatureAsync({
      type: 'event-store',
      useFactory: async () => {
        // connect();

        return {
          type: 'event-store',
          featureStreamName: '$ce-game',
          store: MongoStore('game'),
          subscriptions: [
            {
              type: EventStoreSubscriptionType.CatchUp, // research various types
              stream: '$ce-game',
              resolveLinkTos: true, // Default is true (Optional)
              lastCheckpoint: null,
              //fetches from the start. in follow-up PR, store the position somewhere, and setup a configservice that can read this position and insert it here
            },
          ],
          eventHandlers: EventStoreInstanciators,
        };
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
