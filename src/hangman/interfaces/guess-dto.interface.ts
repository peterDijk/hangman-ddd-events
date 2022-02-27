import { Field, InputType } from '@nestjs/graphql';
import { ApiProperty } from '@nestjs/swagger';

@InputType()
export class GuessDto {
  @Field()
  gameId: string;

  @ApiProperty()
  @Field()
  letter: string;
}
