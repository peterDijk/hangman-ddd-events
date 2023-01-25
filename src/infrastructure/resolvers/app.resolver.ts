import { Logger, UseGuards } from '@nestjs/common';
import { Query, Resolver } from '@nestjs/graphql';
import { MessageResponse } from '../dto/App.dto';
import { GqlAuthGuard } from '../modules/graphql.guard';
import { AppService } from '../services/app.service';

@Resolver()
export class AppResolver {
  constructor(private appService: AppService) {}
  private readonly logger = new Logger(AppResolver.name);

  @Query(() => String)
  sayHello(): string {
    return 'Hello Games!';
  }

  @UseGuards(GqlAuthGuard)
  @Query(() => MessageResponse)
  protectedHello(): Record<string, unknown> {
    return this.appService.getAuthHealth();
  }
}
