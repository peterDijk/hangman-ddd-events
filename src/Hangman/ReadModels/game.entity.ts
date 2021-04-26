import { Entity, BaseEntity, Column, PrimaryGeneratedColumn } from 'typeorm';
import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
@Entity()
export class Game extends BaseEntity {
  @Field()
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Field()
  @Column({
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
}
