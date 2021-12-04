import { BaseEntity, Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class EventStoreState extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    type: 'varchar',
    nullable: false,
  })
  streamName: string;

  @Column({
    type: 'integer',
    nullable: false,
  })
  lastCheckpoint: number;
}
