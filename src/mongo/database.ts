import { config } from '../../config';
import * as Mongoose from 'mongoose';
let database: Mongoose.Connection;
export const connect = () => {
  // add your own uri below
  // const uri =
  //   'mongodb://root:example@store-state.db:27017/?retryWrites=true&w=majority';
  const uri = `${config.STORE_STATE_SETTINGS.type}://${config.STORE_STATE_SETTINGS.credentials.username}:${config.STORE_STATE_SETTINGS.credentials.password}@${config.STORE_STATE_SETTINGS.hostname}:${config.STORE_STATE_SETTINGS.port}/?retryWrites=true&w=majority`;
  if (database) {
    return;
  }
  Mongoose.connect(uri, {
    dbName: config.STORE_STATE_SETTINGS.database,
  });
  database = Mongoose.connection;
  database.once('open', async () => {
    console.log('Connected to mongoDB database');
  });
  database.on('error', () => {
    console.log('Error connecting to database');
  });
};
export const disconnect = () => {
  if (!database) {
    return;
  }
  Mongoose.disconnect();
};
