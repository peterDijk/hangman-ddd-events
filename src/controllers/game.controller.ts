import { Controller, Post, Body, BadRequestException } from '@nestjs/common';
import { ApiTags, ApiResponse } from '@nestjs/swagger';
import { GameDto } from '../Hangman/Domain/AggregateRoot/GameDto';
import { GamesService } from 'src/Hangman/Application/Services/games.service';

@Controller('games')
@ApiTags('Games')
export class GamesController {
  constructor(private readonly gameService: GamesService) {}

  @ApiResponse({ status: 201, description: 'Game created' })
  @Post()
  async createGame(@Body() gameDto: GameDto) {
    const { wordToGuess, maxGuesses } = gameDto;
    if (!wordToGuess || !maxGuesses) {
      throw new BadRequestException('missing parameters');
    }
    return this.gameService.createGame(gameDto);
  }
}
