import {
  Controller,
  Post,
  Body,
  BadRequestException,
  Logger,
} from '@nestjs/common';
import { ApiTags, ApiResponse } from '@nestjs/swagger';
import { GamesService } from 'src/Hangman/Application/Services/games.service';

@Controller('games')
@ApiTags('Games')
export class GamesController {
  constructor(private readonly gameService: GamesService) {}

  @ApiResponse({ status: 201, description: 'Game created' })
  @Post()
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
      throw new BadRequestException(err);
    }
  }
}
