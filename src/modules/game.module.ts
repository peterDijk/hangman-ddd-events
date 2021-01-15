import { Module, OnModuleInit } from '@nestjs/common';
import { CQRSModule, CommandBus, EventBus } from '@nestjs/cqrs';
import { EventStoreModule } from 'src/core/event-store/event-store.module';

import { GamesController } from 'src/controllers/game.controller';
import { GamesService } from 'src/Hangman/Application/Services/games.service';
import { GamesRepository } from 'src/Hangman/Domain/Repositories/GamesRepository';
import { StartNewGameCommandHandler } from 'src/Hangman/Application/CommandHandlers/StartNewGame.handler';
import { NewGameStartedEventHandler } from 'src/Hangman/Domain/EventHandlers/NewGameStarted.handler';
import { ModuleRef } from '@nestjs/core';
import { EventStore } from 'src/core/event-store/event-store';
import { NewGameStartedEvent } from 'src/Hangman/Domain/Events/NewGameStarted.event';

const CommandHandlers = [StartNewGameCommandHandler];
const EventHandlers = [NewGameStartedEventHandler];

@Module({
  imports: [CQRSModule, EventStoreModule.forFeature()],
  controllers: [GamesController],
  providers: [
    GamesService,
    ...CommandHandlers,
    ...EventHandlers,
    GamesRepository,
  ],
})
export class GamesModule implements OnModuleInit {
  constructor(
    private readonly moduleRef: ModuleRef,
    private readonly command$: CommandBus,
    private readonly event$: EventBus,
    // private readonly usersSagas: unknown,
    private readonly eventStore: EventStore,
  ) {}

  onModuleInit() {
    this.command$.setModuleRef(this.moduleRef);
    this.event$.setModuleRef(this.moduleRef);
    /** ------------ */
    this.eventStore.setEventHandlers(this.eventHandlers);
    this.eventStore.bridgeEventsTo((this.event$ as any).subject$);
    this.event$.publisher = this.eventStore;
    /** ------------ */
    this.event$.register([NewGameStartedEventHandler]);
    this.command$.register([StartNewGameCommandHandler]);
    // this.event$.combineSagas([this.usersSagas.userCreated]);
  }

  eventHandlers = {
    NewGameStartedEvent: (data) => new NewGameStartedEvent(data),
  };
}
