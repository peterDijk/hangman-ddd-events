import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { Logger } from '@nestjs/common';
import { GamesRepository } from '../../repository/game.repository';
import { GetGameesQuery } from '../impl/get-games.query';

@QueryHandler(GetGameesQuery)
export class GetGamesHandler implements IQueryHandler<GetGameesQuery> {
  constructor(private readonly repository: GamesRepository) {}
  private readonly logger = new Logger(GetGamesHandler.name);

  async execute(query: GetGameesQuery) {
    this.logger.log('Async GetGameesQuery...');
    return this.repository.findAll();
  }
}
