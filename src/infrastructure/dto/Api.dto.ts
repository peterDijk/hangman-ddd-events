import { Field, ObjectType } from '@nestjs/graphql';
import { Game as GameProjection } from '../read-models/game.entity';
import { User as UserProjection } from '../read-models/user.entity';

@ObjectType()
export class GameResponse {
  @Field()
  message: string;

  @Field((type) => String, { nullable: true })
  gameId?: string;

  @Field((type) => String, { nullable: true })
  error?: string;

  @Field()
  status: number;

  @Field((type) => String, { nullable: true })
  playerFullName: string;

  @Field((type) => [String], { nullable: true })
  lettersGuessed: string[];

  @Field((type) => String, { nullable: false })
  wordToGuess: string;

  @Field((type) => Date, { nullable: false })
  dateCreated: Date;

  @Field((type) => Date, { nullable: false })
  dateModified: Date;
}

@ObjectType()
export class AllGamesResponse {
  @Field((type) => Number)
  count: number;

  @Field((type) => [GameResponse], { nullable: true })
  games: GameResponse[];
}

@ObjectType()
export class AllUsersResponse {
  @Field((type) => Number)
  count: number;

  @Field((type) => [UserProjection], { nullable: true })
  users: UserProjection[];
}
