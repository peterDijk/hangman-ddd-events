import { Entity, BaseEntity, Column, PrimaryColumn } from 'typeorm';
import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
@Entity()
export class Game extends BaseEntity {
  @Field()
  @PrimaryColumn({
    type: 'varchar',
    nullable: false,
  })
  gameId: string;

  @Field()
  @Column({
    type: 'varchar',
    nullable: false,
  })
  playerId: string;

  @Field()
  @Column({
    type: 'varchar',
    nullable: false,
  })
  playerName: string;

  @Field()
  @Column({
    type: 'varchar',
    nullable: false,
  })
  wordToGuess: string;

  @Field()
  @Column({
    type: 'varchar',
    nullable: false,
  })
  maxGuesses: number;

  @Field()
  @Column({
    type: 'json',
    nullable: false,
  })
  lettersGuessed: string[];
}
