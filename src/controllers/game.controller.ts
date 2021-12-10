import { Controller, Post, Body, Logger, Get, Param } from '@nestjs/common';
import { ApiTags, ApiResponse } from '@nestjs/swagger';
import { GuessDto } from '../Hangman/Infrastructure/Dto/Guess.dto';
import { GamesService } from '../Hangman/Application/Services/games.service';
import { GameDto } from '../Hangman/Infrastructure/Dto/Game.dto';

@Controller('games')
@ApiTags('Games')
export class GamesController {
  private readonly logger = new Logger(GamesController.name);

  constructor(private readonly gameService: GamesService) {}

  @ApiResponse({ status: 201, description: 'Game created' })
  @Post('new')
  async startNewGame(
    @Body()
    { playerId, wordToGuess, maxGuesses }: GameDto,
  ) {
    return await this.gameService.startNewGame({
      playerId,
      wordToGuess,
      maxGuesses,
    });
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
  ) {
    return await this.gameService.makeGuess(id, letter);
  }
}
