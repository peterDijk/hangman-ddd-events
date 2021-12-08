import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class GameDto {
  @Field()
  gameId?: string;

  @Field()
  playerId?: string;

  @Field()
  wordToGuess?: string;

  @Field()
  maxGuesses?: number;

  @Field()
  lettersGuessed?: string[];
}
