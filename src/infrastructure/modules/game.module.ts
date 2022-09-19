import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EventStoreModule } from '@peterdijk/nestjs-eventstoredb';
import { GamesController } from '../controllers/game.controller';
import { GamesService } from '../services/games.service';
import { GamesRepository } from '../../domains/Game/Games.repository';
import CommandHandlers from '../../domains/Game/Commands/handlers';
import EventHandlers from '../../domains/Game/Events/handlers';
import ProjectionUpdaters from '../../domains/Game/Updaters';

import { GamesResolver } from '../resolvers/game.resolver';
import { Game as GameProjection } from '../read-models/game.entity';
import { EventSerializers } from '../../domains/Game/Events/EventSerializers';

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
