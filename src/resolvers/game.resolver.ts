import { BadRequestException, Inject, Logger } from '@nestjs/common';
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { GamesService } from 'src/Hangman/Application/Services/games.service';
import { Game } from 'src/Hangman/Domain/AggregateRoot/Game.aggregate';
import { GameDto } from 'src/Hangman/Infrastructure/Dto/Game.dto';

@Resolver((of) => Game)
export class GamesResolver {
  constructor(@Inject(GamesService) private gameService: GamesService) {}
  private readonly logger = new Logger(GamesResolver.name);

  @Query(() => String)
  sayHello(): string {
    return 'Hello World!';
  }

  @Mutation((returns) => Game, { nullable: true })
  async startNewGame(@Args('input') gameDto: GameDto): Promise<Game> {
    return await this.gameService.startNewGame(gameDto);

    // try {
    //   return await this.gameService.startNewGame(gameDto);
    // } catch (err) {
    //   // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error
    //   this.logger.error(err.name, err.stack);

    //   throw new BadRequestException("Can't start a new game");
    // }
  }
}
