import { connect } from './database';
import { StoreStateModel } from './store-state.model';

function toObject(object) {
  return JSON.parse(
    JSON.stringify(
      object,
      (key, value) => (typeof value === 'bigint' ? value.toString() : value), // return everything else unchanged
    ),
  );
}

export async function MongoPositionStore() {
  connect();

  return {
    set: async (streamName: string, position: Object) => {
      console.log('-- updateOneOrCreate', { streamName, position });
      const posObject = toObject(position);
      const updateCheckpoint = await StoreStateModel.updateOneOrCreate({
        streamName,
        position: JSON.stringify(posObject),
      });
      // return updateCheckpoint.position;
    },
    get: async (streamName: string) => {
      console.log('getting position from mongodb for stream', { streamName });
      const streamPosition = await StoreStateModel.findByStream({ streamName });
      if (streamPosition && streamPosition.position !== null) {
        return JSON.parse(streamPosition.position);
      } else {
        return null;
      }
    },
    clear: () => null,
  };
}
