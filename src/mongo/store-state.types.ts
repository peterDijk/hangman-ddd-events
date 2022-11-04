import { Document, Model } from 'mongoose';

export interface IStoreState {
  streamName: string;
  position: string;
  dateOfEntry?: Date;
  lastUpdated?: Date;
}
export interface IStoreStateDocument extends IStoreState, Document {}
// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface IStoreStateModel extends Model<IStoreStateDocument> {
  updateOneOrCreate: ({
    streamName,
    position,
  }: {
    streamName: string;
    position: string;
  }) => Promise<IStoreStateDocument>;
  findByStream: ({
    streamName,
  }: {
    streamName: string;
  }) => Promise<IStoreStateDocument>;
}
