import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { GameDto } from '../dto/Game.dto';
import { StartNewGameCommand } from '../../domains/Game/Commands/StartNewGame.command';
import { Game as GameProjection } from '../read-models/game.entity';
import { v4 as uuidv4 } from 'uuid';
import { GuessLetterCommand } from '../../domains/Game/Commands/GuessLetter.command';
import { User } from '../../domains/User/User.aggregate';
import { Game } from '../../domains/Game/Game.aggregate';
import { GameResponse } from '../dto/Api.dto';

@Injectable()
export class GamesService {
  constructor(
    private readonly commandBus: CommandBus,
    @InjectRepository(GameProjection)
    private gamesProjectionRepository: Repository<GameProjection>,
  ) {}
  private readonly logger = new Logger(GamesService.name);

  async startNewGame(data: GameDto, user: User) {
    const gameId = uuidv4();

    const game: Game = await this.commandBus.execute(
      new StartNewGameCommand(data, gameId, user),
    );
    try {
      this.logger.log(`New game started; ${gameId}`);
      return {
        message: 'success',
        status: 201,
        gameId,
        playerFullName: 'game.player.userName.value',
        wordToGuess: game.wordToGuess.value,
        lettersGuessed: game.lettersGuessed.value.map((l) => l.value),
      };
    } catch (err) {
      this.logger.log(err);
      this.logger.error(err.name, err.stack);
      throw new BadRequestException(err);
    }
  }

  async getAllGames() {
    const games = await this.gamesProjectionRepository.find({
      order: { dateModified: 'DESC' },
    });

    // this.logger.debug(games);
    return {
      count: games.length,
      games: games.map(
        (game) =>
          ({
            gameId: game.id,
            playerFullName: game.playerName,
            lettersGuessed: game.lettersGuessed,
            wordToGuess: game.wordToGuess,
            dateCreated: game.dateCreated,
            dateModified: game.dateModified,
          } as unknown as GameResponse),
      ),
    };
  }

  async makeGuess(gameId: string, letter: string, loggedInUser: User) {
    try {
      const game: Game = await this.commandBus.execute(
        new GuessLetterCommand(gameId, letter, loggedInUser),
      );

      return {
        message: 'success',
        status: 200,
        gameId,
        letter,
        wordToGuess: game.wordToGuess.value,
        lettersGuessed: game.lettersGuessed.value.map((l) => l.value),
        playerFullName: game.player.userName.value,
        gameModified: game.dateModified,
        gameCreated: game.dateCreated,
      };
    } catch (err) {
      this.logger.error(err.name, err.stack);

      throw new BadRequestException(err, 'Cant make guess');
    }
  }
}
