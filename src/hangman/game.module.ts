import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EventStoreModule } from '@peterdijk/nestjs-eventstoredb';
import { GamesController } from './game.controller';
import { GamesService } from './games.service';
import { GamesRepository } from './repository/game.repository';
import { CommandHandlers } from './commands/handlers';
import { EventHandlers } from './events/handlers';
import { StateUpdaters } from './events/updaters';

import { GamesResolver } from './game.resolver';
import { Game as GameProjection } from './projections/game.entity';
import { EventSerializers } from './events/impl/EventSerializers';

const STREAM_GAME_PREFIX = 'game';

@Module({
  imports: [
    CqrsModule,
    EventStoreModule.forFeature({
      streamPrefix: STREAM_GAME_PREFIX,
      eventSerializers: EventSerializers, // What does this do?
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
    ...StateUpdaters,
  ],
})
export class GamesModule {}
