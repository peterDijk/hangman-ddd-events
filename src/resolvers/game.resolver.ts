import { Inject, Logger } from '@nestjs/common';
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { GamesService } from '../Hangman/Application/Services/games.service';
import { Game } from '../Hangman/Domain/AggregateRoot/Game.aggregate';
import {
  AllGamesResponse,
  GameResponse,
} from '../Hangman/Infrastructure/Dto/Api.dto';
import { GameDto } from '../Hangman/Infrastructure/Dto/Game.dto';
import { Game as GameProjection } from '../Hangman/ReadModels/game.entity';

@Resolver((of) => Game)
export class GamesResolver {
  constructor(@Inject(GamesService) private gameService: GamesService) {}
  private readonly logger = new Logger(GamesResolver.name);

  @Query(() => String)
  sayHello(): string {
    return 'Hello World!';
  }

  @Mutation((returns) => GameResponse)
  async startNewGame(@Args('input') gameDto: GameDto): Promise<GameResponse> {
    return await this.gameService.startNewGame(gameDto);
  }

  @Query((returns) => AllGamesResponse)
  async getAllGames(): Promise<{ count: number; games: GameProjection[] }> {
    return await this.gameService.getAllGames();
  }
}
