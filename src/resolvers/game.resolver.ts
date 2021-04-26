import { BadRequestException, Inject, Logger } from '@nestjs/common';
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { GamesService } from '../Hangman/Application/Services/games.service';
import { Game } from '../Hangman/Domain/AggregateRoot/Game.aggregate';
import { ApiResponse } from '../Hangman/Infrastructure/Dto/Api.dto';
import { GameDto } from '../Hangman/Infrastructure/Dto/Game.dto';

@Resolver((of) => Game)
export class GamesResolver {
  constructor(@Inject(GamesService) private gameService: GamesService) {}
  private readonly logger = new Logger(GamesResolver.name);

  @Query(() => String)
  sayHello(): string {
    return 'Hello World!';
  }

  @Mutation((returns) => ApiResponse)
  async startNewGame(@Args('input') gameDto: GameDto): Promise<ApiResponse> {
    return await this.gameService.startNewGame(gameDto);
  }
}
