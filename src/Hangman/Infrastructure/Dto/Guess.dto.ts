import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class GuessDto {
  @Field()
  gameId: string;

  @Field()
  letter: string;
}
