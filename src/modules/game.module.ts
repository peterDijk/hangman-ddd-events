import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EventStoreModule } from '@peterdijk/nestjs-eventstoredb';
import { GamesController } from '../controllers/game.controller';
import { GamesService } from '../Hangman/Application/Services/games.service';
import { GamesRepository } from '../Hangman/Domain/Repositories/GamesRepository';
import CommandHandlers from '../Hangman/Application/CommandHandlers';
import EventHandlers from '../Hangman/Domain/EventHandlers';
import ProjectionUpdaters from '../Hangman/Domain/Updaters';

import { GamesResolver } from '../resolvers/game.resolver';
import { Game as GameProjection } from '../Hangman/ReadModels/game.entity';
import { EventSerializers } from '../Hangman/Domain/Events/EventSerializers';

@Module({
  imports: [
    CqrsModule,
    EventStoreModule.forFeature({
      streamPrefix: 'game',
      eventSerializers: EventSerializers,
    }),
    TypeOrmModule.forFeature([GameProjection]),
  ],
  exports: [CqrsModule],
  controllers: [GamesController],
  providers: [
    GamesResolver,
    GamesService,
    GamesRepository,
    ...CommandHandlers,
    ...EventHandlers,
    ...ProjectionUpdaters,
  ],
})
export class GamesModule {}
