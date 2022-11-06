import { Entity, BaseEntity, Column, PrimaryColumn } from 'typeorm';
import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
@Entity()
export class User extends BaseEntity {
  @Field()
  @PrimaryColumn({
    type: 'varchar',
    nullable: false,
  })
  userId: string;

  @Field()
  @Column({
    type: 'varchar',
    nullable: false,
  })
  username: string;

  @Field()
  @Column({
    type: 'varchar',
    nullable: false,
  })
  password: string;

  @Field()
  @Column({
    type: 'int',
    nullable: false,
    default: 0,
  })
  numberLogins: number;

  @Field()
  @Column({
    type: 'timestamp',
    nullable: false,
    default: () => 'CURRENT_TIMESTAMP',
  })
  lastLoggedIn: Date;

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
