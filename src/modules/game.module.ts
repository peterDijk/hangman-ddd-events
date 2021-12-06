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
@Module({
  imports: [EventStoreStateModule],
})
export class GamesModule {
  constructor(
    @Inject(EventStoreStateService)
    private readonly eventStoreStateService: EventStoreStateService,
  ) {}
  static register(): DynamicModule {
    return {
      module: GamesModule,
      imports: [
        CqrsModule,
        EventStoreModule.registerFeatureAsync({
          type: 'event-store',
          useFactory: async (...args) => {
            console.log({ args });
            return {
              featureStreamName: '$ce-game',
              type: 'event-store',
              subscriptions: [
                {
                  type: EventStoreSubscriptionType.CatchUp, // research various types
                  stream: '$ce-game',
                  resolveLinkTos: true,
                },
              ],
              eventHandlers: EventStoreInstanciators,
              store: {
                storeKey: 'game',
                write: async (key: string, value: number) => {
                  // TODO: on every new event for stream x this function
                  // is called with the last position number
                  // problem: we need access to the service that connects
                  // to ORM, but it's a static method so no access to whatever
                  // is injected in the constructor
                  //
                  // const newCheckpoint = await this.eventStoreStateService.updateCheckpoint(
                  //   key,
                  //   value,
                  // );
                  return Promise.resolve(0);
                },
                read: async (key: string) => {
                  // same as write function
                  //
                  return Promise.resolve(16);
                },
                clear: () => null,
              },
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
    };
  }
}
