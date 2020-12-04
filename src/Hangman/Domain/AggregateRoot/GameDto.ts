// import { IsString } from 'class-validator';

export class GameDto {
  // @IsString()
  readonly gameId!: string;

  // @IsString()
  readonly playerId!: string;

  readonly wordToGuess!: string;

  readonly maxGuesses!: number;
}
