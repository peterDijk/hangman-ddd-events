import { config } from '../../config';
import Mongoose from 'mongoose';
let database: Mongoose.Connection;
export const mongoDbUri = `${config.STORE_STATE_SETTINGS.type}://${config.STORE_STATE_SETTINGS.credentials.username}:${config.STORE_STATE_SETTINGS.credentials.password}@${config.STORE_STATE_SETTINGS.hostname}:${config.STORE_STATE_SETTINGS.port}/?retryWrites=true&w=majority`;

export const connect = () => {
  if (database) {
    console.log('already set up database');
    return database;
  }

  console.log({ mongoDbUri });
  Mongoose.connect(mongoDbUri, {
    dbName: config.STORE_STATE_SETTINGS.database,
  });
  database = Mongoose.connection;
  database.once('open', async () => {
    console.log('Connected to mongoDB database');
    return database;
  });
  database.on('error', () => {
    throw Error('Error connecting to database');
  });
};
export const disconnect = () => {
  if (!database) {
    return;
  }
  Mongoose.disconnect();
};
