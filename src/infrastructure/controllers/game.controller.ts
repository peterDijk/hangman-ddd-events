import { Controller, Post, Body, Logger, Get, Param } from '@nestjs/common';
import { ApiTags, ApiResponse } from '@nestjs/swagger';
import { GuessDto } from '../dto/Guess.dto';
import { GamesService } from '../services/games.service';
import { GameDto } from '../dto/Game.dto';
import { CurrentUser } from '../modules/graphql.guard';
import { User } from '../../domains/User/User.aggregate';

@Controller('games')
@ApiTags('Games')
export class GamesController {
  private readonly logger = new Logger(GamesController.name);

  constructor(private readonly gameService: GamesService) {}

  @ApiResponse({ status: 201, description: 'Game created' })
  @Post('new')
  async startNewGame(
    @Body()
    { wordToGuess, maxGuesses }: GameDto,
    @CurrentUser() user: User,
  ) {
    return await this.gameService.startNewGame(
      {
        wordToGuess,
        maxGuesses,
      },
      user,
    );
  }

  @ApiResponse({ status: 200, description: 'List games' })
  @Get('list')
  async getAllGames() {
    return await this.gameService.getAllGames();
  }

  @ApiResponse({ status: 200, description: 'Guess made' })
  @Post('/:id/guess')
  async makeGuess(
    @Param() { id },
    @Body()
    { letter }: GuessDto,
    @CurrentUser() user: User,
  ) {
    return await this.gameService.makeGuess(id, letter, user);
  }
}
