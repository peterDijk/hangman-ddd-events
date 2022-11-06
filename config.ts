import * as dotenv from 'dotenv';
import * as pkg from './package.json';

// Load environment variables from .env file
dotenv.config();

const envDevelopmentName = 'development';
const env = process.env.NODE_ENV || envDevelopmentName;
const configs = {
  base: {
    ENV: env,
    DEV: env === envDevelopmentName,
    // General
    NAME: process.env.APP_NAME || pkg.name,
    TITLE: process.env.APP_TITLE || 'HANGMAN THE GAME',
    DESCRIPTION: process.env.APP_DESCRIPTION || 'Hangman Game API Microservice',
    // API
    PREFIX: process.env.APP_PREFIX || 'v1',
    VERSION: process.env.APP_VERSION || '1.0',
    API_EXPLORER_PATH: process.env.APP_API_EXPLORER_PATH || '/api',
    // Server
    HOST: process.env.APP_HOST || '0.0.0.0',
    PORT: process.env.CONTAINER_PORT || 3000, // internal container port
    EXT_PORT: process.env.APP_PORT || 3000,
    GQL_PLAYGROUND: process.env.GQL_PLAYGROUND === 'enabled' ? true : false,
    // Event Store
    EVENT_STORE_SETTINGS: {
      protocol: process.env.EVENT_STORE_PROTOCOL || 'http',
      hostname: process.env.EVENT_STORE_HOSTNAME || '127.0.0.1',
      tcpPort: process.env.EVENTSTORE_EXT_TCP_PORT || 1113,
      httpPort: process.env.EVENTSTORE_EXT_HTTP_PORT || 2113,
      credentials: {
        username: process.env.EVENT_STORE_CREDENTIALS_USERNAME || 'admin',
        password: process.env.EVENT_STORE_CREDENTIALS_PASSWORD || 'changeit',
      },
      poolOptions: {
        min: process.env.EVENT_STORE_POOLOPTIONS_MIN || 1,
        max: process.env.EVENT_STORE_POOLOPTIONS_MAX || 10,
      },
    },
    PROJECTION_DB_SETTINGS: {
      hostname: process.env.PROJECTIONS_HOSTNAME || '127.0.0.1',
      port: process.env.PROJECTIONS_PORT || 3310,
      credentials: {
        username: process.env.PROJECTIONS_CREDENTIALS_USERNAME || 'root',
        password: process.env.PROJECTIONS_CREDENTIALS_PASSWORD || 'example',
      },
      type: process.env.PROJECTIONS_DB_TYPE || 'mysql',
      database: process.env.PROJECTIONS_DATABASE || 'hangman-projections',
    },
    STORE_STATE_SETTINGS: {
      hostname: process.env.STORE_STATE_HOSTNAME || '127.0.0.1',
      port: process.env.STORE_STATE_PORT || 27017,
      credentials: {
        username: process.env.STORE_STATE_USERNAME || 'root',
        password: process.env.STORE_STATE_PASSWORD || 'example',
      },
      type: process.env.STORE_STATE_DB_TYPE || 'mongodb',
      database: process.env.STORE_STATE_DB || 'hangman-position',
    },
  },
  development: {},
  production: {
    PORT: process.env.APP_PORT || 7071,
  },
  test: {
    PORT: 7072,
  },
};
const config = { ...configs.base, ...configs[env] };

export { config };
