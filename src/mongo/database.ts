import * as Mongoose from 'mongoose';
let database: Mongoose.Connection;
export const connect = () => {
  // add your own uri below
  const uri =
    'mongodb://root:example@store-state.db:27017/?retryWrites=true&w=majority';
  if (database) {
    return;
  }
  Mongoose.connect(uri, {
    // useNewUrlParser: true,
    // useFindAndModify: true,
    // useUnifiedTopology: true,
    // useCreateIndex: true,
    dbName: 'store-state',
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
