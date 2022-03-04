import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { Logger } from '@nestjs/common';
import { GamesRepository } from '../../repository/game.repository';
import { GetGamesQuery } from '../impl/get-games.query';

@QueryHandler(GetGamesQuery)
export class GetGamesHandler implements IQueryHandler<GetGamesQuery> {
  constructor(private readonly repository: GamesRepository) {}
  private readonly logger = new Logger(GetGamesHandler.name);

  async execute(query: GetGamesQuery) {
    this.logger.log('Async GetGamesQuery...');
    return this.repository.findAll();
  }
}
