import { Logger } from '@nestjs/common';
import { Query, Resolver } from '@nestjs/graphql';

@Resolver()
export class AppResolver {
  constructor() {}
  private readonly logger = new Logger(AppResolver.name);

  @Query(() => String)
  sayHello(): string {
    return 'Hello Games!';
  }
}
