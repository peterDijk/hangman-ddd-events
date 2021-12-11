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
import { EventSourcingModule } from '@berniemac/event-sourcing-nestjs';
import { EventStoreEventPublisher } from '../Hangman/Infrastructure/EventStore/Publisher';
import { EventStoreEventSubscriber } from '../Hangman/Infrastructure/EventStore/Subscriber';

@Module({
  imports: [
    CqrsModule,
    // EventSourcingModule.forFeature(),

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
    EventStoreEventPublisher,
    EventStoreEventSubscriber,
  ],
})
export class GamesModule implements OnModuleInit {
  constructor(
    private readonly event$: EventBus,
    private readonly eventstorePublisher: EventStoreEventPublisher,
    private readonly eventstoreSubscriber: EventStoreEventSubscriber,
  ) {}

  async onModuleInit(): Promise<any> {
    await this.eventstoreSubscriber.connect();
    this.eventstoreSubscriber.bridgeEventsTo(this.event$.subject$);

    await this.eventstorePublisher.connect();
    this.event$.publisher = this.eventstorePublisher;
  }
}
