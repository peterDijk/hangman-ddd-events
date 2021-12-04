import { DynamicModule, Inject, Module } from '@nestjs/common';
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
import { EventStoreStateService } from '../Hangman/Application/Services/eventstore.service';
import { EventStoreStateModule } from './eventstore.module';

export interface GameModuleOptions {
  lastCheckpoint: number;
}
@Module({
  imports: [EventStoreStateModule],
})
export class GamesModule {
  // constructor(
  //   @Inject(EventStoreStateService)
  //   private readonly eventStoreStateService: EventStoreStateService,
  // ) {}
  static register(): // updateCheckpoint: (key: string, value: number) => Promise<number>,
  // getLastCheckpoint: (key: string) => Promise<number>,
  DynamicModule {
    return {
      module: GamesModule,
      imports: [
        CqrsModule,
        EventStoreModule.registerFeatureAsync({
          type: 'event-store',
          useFactory: async (...args) => ({
            featureStreamName: '$ce-game',
            type: 'event-store',
            subscriptions: [
              {
                type: EventStoreSubscriptionType.CatchUp, // research various types
                stream: '$ce-game',
                resolveLinkTos: true, // Default is true (Optional)
                // lastCheckpoint: options.lastCheckpoint,
                //fetches from the start. in follow-up PR, store the position somewhere, and setup a configservice that can read this position and insert it here
              },
            ],
            eventHandlers: EventStoreInstanciators,
            store: {
              storeKey: 'game',
              write: async (key: string, value: number) => {
                // const newCheckpoint = await this.eventStoreStateService.updateCheckpoint(
                //   key,
                //   value,
                // );
                // console.log({ newCheckpoint });
                return updateCheckpoint?.(key, value);
              },
              read: async (key: string) => {
                // const streamCheckpoint = await this.eventStoreStateService.getLastCheckpoint(
                //   key,
                // );
                // return streamCheckpoint.lastCheckpoint;
                return getLastCheckpoint?.(key);
              },
              clear: () => null,
            },
          }),
        }),
        TypeOrmModule.forFeature([GameProjection]),
      ],
      controllers: [GamesController],
      providers: [
        EventStoreStateService,
        GamesResolver,
        GamesService,
        GamesRepository,
        ...CommandHandlers,
        ...EventHandlers,
      ],
    };
  }
}
