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
  name: string;
}
