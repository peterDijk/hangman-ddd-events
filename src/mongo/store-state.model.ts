import { model } from 'mongoose';
import { IStoreStateDocument, IStoreStateModel } from './store-state.types';
import StoreStateSchema from './store-state.schema';

// const User = model<IUser, UserModel>('User', schema);

export const StoreStateModel = model<IStoreStateDocument, IStoreStateModel>(
  'store-state',
  StoreStateSchema,
);
