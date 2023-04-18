import {
  Entity,
  BaseEntity,
  Column,
  PrimaryColumn,
  ObjectIdColumn,
  ObjectID,
} from 'typeorm';
import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
@Entity()
export class Game extends BaseEntity {
  @ObjectIdColumn()
  id: ObjectID;

  @Field()
  @Column()
  gameId: string;

  @Field()
  @Column()
  playerId: string;

  @Field()
  @Column()
  playerName: string;

  @Field()
  @Column()
  wordToGuess: string;

  @Field()
  @Column()
  maxGuesses: number;

  @Field((type) => [String], { nullable: true })
  @Column()
  lettersGuessed: string[];

  @Field()
  @Column({
    type: 'timestamp',
    nullable: false,
    default: () => 'CURRENT_TIMESTAMP',
  })
  dateCreated: Date;

  @Field()
  @Column({
    type: 'timestamp',
    nullable: false,
    default: () => 'CURRENT_TIMESTAMP',
  })
  dateModified: Date;
}
