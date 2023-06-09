import {
  Entity,
  BaseEntity,
  Column,
  PrimaryColumn,
  ObjectIdColumn,
  ObjectID,
} from 'typeorm';
import { Field, ObjectType } from '@nestjs/graphql';
import { Exclude } from 'class-transformer';

@ObjectType()
@Entity()
export class User extends BaseEntity {
  @ObjectIdColumn()
  id: ObjectID;

  @Field()
  @Column()
  userId: string;

  @Field()
  @Column()
  username: string;

  @Column()
  @Exclude({ toPlainOnly: true })
  password: string;

  @Field()
  @Column()
  fullName: string;

  @Field()
  @Column({ default: 0 })
  numberLogins: number;

  @Field()
  @Column()
  lastLoggedIn: Date;

  @Field()
  @Column()
  dateCreated: Date;

  @Field()
  @Column()
  dateModified: Date;
}
