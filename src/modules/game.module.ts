import { Module, OnModuleInit } from '@nestjs/common';
import { CqrsModule, EventBus } from '@nestjs/cqrs';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GamesController } from '../controllers/game.controller';
import { GamesService } from '../Hangman/Application/Services/games.service';
import { GamesRepository } from '../Hangman/Domain/Repositories/GamesRepository';
import CommandHandlers from '../Hangman/Application/CommandHandlers';
import EventHandlers from '../Hangman/Domain/EventHandlers';
import ProjectionUpdaters from '../Hangman/Domain/Updaters';

import { GamesResolver } from '../resolvers/game.resolver';
import { Game as GameProjection } from '../Hangman/ReadModels/game.entity';
import { EventSourcingModule } from './eventstore.module';

@Module({
  imports: [
    CqrsModule,
    EventSourcingModule.forFeature(),
    TypeOrmModule.forFeature([GameProjection]),
  ],
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
