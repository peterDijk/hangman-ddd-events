import { Field, InputType } from '@nestjs/graphql';
import { ApiProperty } from '@nestjs/swagger';

@InputType()
export class GameDto {
  @ApiProperty()
  @Field()
  wordToGuess?: string;

  @ApiProperty()
  @Field()
  maxGuesses?: number;
}
