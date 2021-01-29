import {
  Controller,
  Post,
  Body,
  BadRequestException,
  Logger,
  UseFilters,
} from '@nestjs/common';
import { ApiTags, ApiResponse } from '@nestjs/swagger';
import { GamesService } from 'src/Hangman/Application/Services/games.service';
import { HttpExceptionFilter } from 'src/Hangman/Exceptions/http-exception.filter';

@Controller('games')
@ApiTags('Games')
export class GamesController {
  constructor(private readonly gameService: GamesService) {}

  @ApiResponse({ status: 201, description: 'Game created' })
  @Post()
  // @UseFilters(HttpExceptionFilter)
  async startNewGame(
    @Body()
    {
      gameId,
      playerId,
      wordToGuess,
      maxGuesses,
    }: {
      gameId: string;
      playerId: string;
      wordToGuess: string;
      maxGuesses: string;
    },
  ) {
    try {
      return await this.gameService.startNewGame(
        gameId,
        playerId,
        wordToGuess,
        parseInt(maxGuesses),
      );
    } catch (err) {
      Logger.log(JSON.stringify(err), 'caught error');
      throw new BadRequestException(err, 'missing parameters pvd');
    }
  }
}
