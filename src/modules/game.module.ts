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
import { MongoStore } from '../mongo/mongo-eventstore-adapter';

@Module({
  imports: [
    CqrsModule,
    EventStoreModule.registerFeatureAsync({
      type: 'event-store',
      useFactory: async () => {
        const streamName = 'game';

        return {
          type: 'event-store',
          featureStreamName: `$ce-${streamName}`,
          store: MongoStore(streamName),
          subscriptions: [
            {
              type: EventStoreSubscriptionType.CatchUp,
              stream: `$ce-${streamName}`,
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
