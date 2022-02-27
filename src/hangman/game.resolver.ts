import { Inject, Logger } from '@nestjs/common';
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { GamesService } from './games.service';
import { Game } from './models/game.model';
import { AllGamesResponse, GameResponse } from './interfaces/api-dto.interface';
import { GameDto } from './interfaces/game-dto.interface';
import { GuessDto } from './interfaces/guess-dto.interface';
import { Game as GameProjection } from './projections/game.entity';

@Resolver((of) => Game)
export class GamesResolver {
  constructor(@Inject(GamesService) private gameService: GamesService) {}
  private readonly logger = new Logger(GamesResolver.name);

  @Query(() => String)
  sayHello(): string {
    return 'Hello World!';
  }

  @Query((returns) => AllGamesResponse)
  async getAllGames(): Promise<{ count: number; games: GameProjection[] }> {
    return await this.gameService.getAllGames();
  }

  @Mutation((returns) => GameResponse)
  async startNewGame(@Args('input') gameDto: GameDto): Promise<GameResponse> {
    return await this.gameService.startNewGame(gameDto);
  }

  @Mutation((returns) => GameResponse)
  async makeGuess(@Args('input') guessDto: GuessDto): Promise<GameResponse> {
    return await this.gameService.makeGuess(guessDto.gameId, guessDto.letter);
  }
}
