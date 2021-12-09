import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class GameDto {
  @Field()
  playerId?: string;

  @Field()
  wordToGuess?: string;

  @Field()
  maxGuesses?: number;
}
