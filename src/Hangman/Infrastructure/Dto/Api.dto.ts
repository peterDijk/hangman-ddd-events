import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class ApiResponse {
  @Field()
  message: string;

  @Field((type) => String, { nullable: true })
  error?: string;

  @Field()
  status: number;
}
