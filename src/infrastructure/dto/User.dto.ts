import { Field, InputType, ObjectType } from '@nestjs/graphql';
import { ApiProperty } from '@nestjs/swagger';

@InputType()
export class UserDto {
  @ApiProperty()
  @Field()
  username: string;

  @ApiProperty()
  @Field()
  password: string;

  @ApiProperty()
  @Field()
  fullName: string;
}

// @ObjectType()
// export class UserResponse {
//   @ApiProperty()
//   @Field((type) => String)
//   userId: string;

//   @ApiProperty()
//   @Field((type) => String)
//   username: string;

//   @ApiProperty()
//   @Field((type) => String)
//   message: string;
// }
