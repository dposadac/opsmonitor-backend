import { ConfigService } from '@nestjs/config';
import { MongooseModuleOptions } from '@nestjs/mongoose';

/**
 * Centralized MongoDB connection options + pooling configuration.
 */
export function mongooseModuleFactory(config: ConfigService): MongooseModuleOptions {
  return {
    uri: config.get<string>('MONGO_URI'),
    maxPoolSize: config.get<number>('MONGO_POOL_MAX', 10),
    serverSelectionTimeoutMS: 5000,
  };
}
