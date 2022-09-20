import { Schema } from 'mongoose';
import { updateOneOrCreate, findByStream } from './store-state.statics';
import { IStoreState, IStoreStateModel } from './store-state.types';

const StoreState = new Schema<IStoreState, IStoreStateModel>({
  streamName: String,
  position: Object,
  dateOfEntry: {
    type: Date,
    default: new Date(),
  },
  lastUpdated: {
    type: Date,
    default: new Date(),
  },
});

StoreState.static('updateOneOrCreate', updateOneOrCreate);
StoreState.static('findByStream', findByStream);

export default StoreState;
