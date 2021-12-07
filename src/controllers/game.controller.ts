import {
  Controller,
  Post,
  Body,
  BadRequestException,
  Logger,
  Get,
} from '@nestjs/common';
import { ApiTags, ApiResponse } from '@nestjs/swagger';
import { GamesService } from '../Hangman/Application/Services/games.service';

@Controller('games')
@ApiTags('Games')
export class GamesController {
  private readonly logger = new Logger(GamesController.name);

  constructor(private readonly gameService: GamesService) {}

  @ApiResponse({ status: 201, description: 'Game created' })
  @Post('new')
  async startNewGame(
    @Body()
    {
      playerId,
      wordToGuess,
      maxGuesses,
    }: {
      playerId: string;
      wordToGuess: string;
      maxGuesses: string;
    },
  ) {
    return await this.gameService.startNewGame({
      playerId,
      wordToGuess,
      maxGuesses: parseInt(maxGuesses),
    });
  }

  @ApiResponse({ status: 200, description: 'List games' })
  @Get('list')
  async getAllGames() {
    return await this.gameService.getAllGames();
  }
}
