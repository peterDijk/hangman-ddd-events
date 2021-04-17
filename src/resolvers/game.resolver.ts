import { Inject, Logger, UseGuards } from '@nestjs/common';
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { GamesService } from 'src/Hangman/Application/Services/games.service';
import { Game } from 'src/Hangman/Domain/AggregateRoot/Game.aggregate';

@Resolver((of) => Game)
export class GamesResolver {
  constructor(@Inject(GamesService) private eventService: GamesService) {}

  @Query(() => String)
  sayHello(): string {
    return 'Hello World!';
  }
}
