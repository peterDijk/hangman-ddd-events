import { CommandHandler, EventPublisher, ICommandHandler } from '@nestjs/cqrs';
import { StartNewGameCommand } from '../Commands/StartNewGame.command';
import { Logger } from '@nestjs/common';
import { GamesRepository } from '../../Domain/Repositories/GamesRepository';
// import { StoreEventPublisher } from '@berniemac/event-sourcing-nestjs';
import { EventStoreDBClient } from '@eventstore/db-client';

@CommandHandler(StartNewGameCommand)
export class StartNewGameCommandHandler
  implements ICommandHandler<StartNewGameCommand> {
  private readonly logger = new Logger(StartNewGameCommandHandler.name);

  constructor(
    private publisher: EventPublisher,
    private readonly repository: GamesRepository,
  ) {}

  private client = EventStoreDBClient.connectionString(
    'esdb://eventstore.db:2113?tls=false',
  );

  async execute({ data, uuid }: StartNewGameCommand) {
    const { playerId, wordToGuess, maxGuesses } = data;

    const game = this.publisher.mergeObjectContext(
      await this.repository.startNewGame(
        { playerId, wordToGuess, maxGuesses },
        uuid,
      ),
    );

    game.commit();
  }
}
