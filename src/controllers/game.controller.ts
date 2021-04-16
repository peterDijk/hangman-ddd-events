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
  private readonly logger = new Logger(GamesController.name);

  constructor(private readonly gameService: GamesService) {}

  @ApiResponse({ status: 201, description: 'Game created' })
  @Post()
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
    try {
      return await this.gameService.startNewGame({
        playerId,
        wordToGuess,
        maxGuesses: parseInt(maxGuesses),
      });
    } catch (err) {
      // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error
      this.logger.error(err.name, err.stack);

      throw new BadRequestException("Can't start a new game");
    }
  }
}
