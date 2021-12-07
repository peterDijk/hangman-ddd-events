import { IStoreStateDocument, IStoreStateModel } from './store-state.types';

export async function updateOneOrCreate(
  this: IStoreStateModel,
  { streamName, checkpoint }: { streamName: string; checkpoint: number },
): Promise<IStoreStateDocument> {
  const record = await this.findOne({ streamName });
  if (record) {
    return record.updateOne({ checkpoint, lastUpdated: new Date() });
  } else {
    return await this.create({ streamName, checkpoint });
  }
}
export async function findByStream(
  this: IStoreStateModel,
  { streamName }: { streamName: string },
): Promise<IStoreStateDocument> {
  return this.findOne({ streamName });
}
