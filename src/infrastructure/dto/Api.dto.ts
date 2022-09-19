import { Field, ObjectType } from '@nestjs/graphql';
import { Game as GameProjection } from '../read-models/game.entity';

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
}

@ObjectType()
export class AllGamesResponse {
  @Field((type) => Number)
  count: number;

  @Field((type) => [GameProjection], { nullable: true })
  games: GameProjection[];
}
