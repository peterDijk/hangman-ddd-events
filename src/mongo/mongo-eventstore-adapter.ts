// import { IAdapterStore } from '@juicycleff/nestjs-event-store';
// import { connect } from './database';
// import { StoreStateModel } from './store-state.model';

// export function MongoStore(key: string): IAdapterStore {
//   connect();

//   return {
//     storeKey: key,
//     write: async (streamName: string, checkpoint: number) => {
//       console.log('-- updateOneOrCreate', { streamName, checkpoint });
//       const updateCheckpoint = await StoreStateModel.updateOneOrCreate({
//         streamName,
//         checkpoint,
//       });
//       return updateCheckpoint.checkpoint;
//     },
//     read: async (streamName: string) => {
//       const streamPosition = await StoreStateModel.findByStream({ streamName });
//       return streamPosition?.checkpoint ?? null;
//     },
//     clear: () => null,
//   };
// }
