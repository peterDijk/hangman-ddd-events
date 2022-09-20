import { Inject, Logger } from '@nestjs/common';
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { GamesService } from '../services/games.service';
import { Game } from '../../domains/Game/Game.aggregate';
import { AllGamesResponse, GameResponse } from '../dto/Api.dto';
import { GameDto } from '../dto/Game.dto';
import { GuessDto } from '../dto/Guess.dto';
import { Game as GameProjection } from '../read-models/game.entity';

@Resolver((of) => Game)
export class GamesResolver {
  constructor(@Inject(GamesService) private gameService: GamesService) {}
  private readonly logger = new Logger(GamesResolver.name);

  @Query(() => String)
  sayHello(): string {
    return 'Hello Games!';
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
  async makeGuess(@Args('input') guesDto: GuessDto): Promise<GameResponse> {
    return await this.gameService.makeGuess(guesDto.gameId, guesDto.letter);
  }
}
