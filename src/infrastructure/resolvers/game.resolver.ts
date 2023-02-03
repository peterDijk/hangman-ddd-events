import { Inject, Logger, UseGuards } from '@nestjs/common';
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { GamesService } from '../services/games.service';
import { Game } from '../../domains/Game/Game.aggregate';
import { AllGamesResponse, GameResponse } from '../dto/Api.dto';
import { GameDto } from '../dto/Game.dto';
import { GuessDto } from '../dto/Guess.dto';
import { Game as GameProjection } from '../read-models/game.entity';
import { CurrentUser, GqlAuthGuard } from '../modules/graphql.guard';
import { User } from '../../domains/User/User.aggregate';

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

  @UseGuards(GqlAuthGuard)
  @Mutation((returns) => GameResponse)
  async startNewGame(
    @Args('input') gameDto: GameDto,
    @CurrentUser() user: User,
  ): Promise<GameResponse> {
    return await this.gameService.startNewGame(gameDto, user);
  }

  @Mutation((returns) => GameResponse)
  async makeGuess(@Args('input') guesDto: GuessDto): Promise<GameResponse> {
    return await this.gameService.makeGuess(guesDto.gameId, guesDto.letter);
  }
}
