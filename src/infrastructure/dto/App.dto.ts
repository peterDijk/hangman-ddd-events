import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class MessageResponse {
  @Field()
  message: string;
}
