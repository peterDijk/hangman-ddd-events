import { IStoreStateDocument, IStoreStateModel } from './store-state.types';

export async function updateOneOrCreate(
  this: IStoreStateModel,
  { streamName, position }: { streamName: string; position: Object },
): Promise<IStoreStateDocument> {
  const record = await this.findOne({ streamName });
  if (record) {
    return record.updateOne({ position, lastUpdated: new Date() });
  } else {
    return await this.create({ streamName, position });
  }
}
export async function findByStream(
  this: IStoreStateModel,
  { streamName }: { streamName: string },
): Promise<IStoreStateDocument> {
  return this.findOne({ streamName });
}
