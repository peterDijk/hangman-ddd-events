import { Field, InputType, ObjectType } from '@nestjs/graphql';

export interface JwtPayload {
  username: string;
}

@InputType()
export class LoginUserDto {
  @Field()
  username: string;

  @Field()
  password: string;
}

@ObjectType()
export class LoginStatus {
  @Field()
  username: string;

  @Field()
  accessToken: string;
}
