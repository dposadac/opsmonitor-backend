import { DynamicModule, Module, Global } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BullModule } from '@nestjs/bullmq';
import { CacheModule } from '@nestjs/cache-manager';
import { mongooseModuleFactory } from './connection/mongoose.config';
import { typeOrmModuleFactory } from './connection/typeorm.config';
import { bullmqModuleFactory } from './connection/bullmq.config';
import { cacheModuleFactory } from './connection/cache.config';
import { TransactionManager } from './transaction/transaction.manager';
import { CacheService } from './cache/cache.service';

/**
 * Data Access Layer entry module. Each app composes only the persistence
 * technologies it needs via the static helpers below.
 */
@Global()
@Module({})
export class RepositoryModule {
  /** PostgreSQL connection management + transaction handling. */
  static forPostgres(): DynamicModule {
    return {
      module: RepositoryModule,
      imports: [
        TypeOrmModule.forRootAsync({
          imports: [ConfigModule],
          inject: [ConfigService],
          useFactory: typeOrmModuleFactory,
        }),
      ],
      providers: [TransactionManager],
      exports: [TypeOrmModule, TransactionManager],
    };
  }

  /** MongoDB connection management. */
  static forMongo(): DynamicModule {
    return {
      module: RepositoryModule,
      imports: [
        MongooseModule.forRootAsync({
          imports: [ConfigModule],
          inject: [ConfigService],
          useFactory: mongooseModuleFactory,
        }),
      ],
      exports: [MongooseModule],
    };
  }

  /** Caching layer (cache-manager backed by Redis via Keyv). */
  static forRedis(): DynamicModule {
    return {
      module: RepositoryModule,
      imports: [
        CacheModule.registerAsync({
          imports: [ConfigModule],
          inject: [ConfigService],
          useFactory: cacheModuleFactory,
        }),
      ],
      providers: [CacheService],
      exports: [CacheModule, CacheService],
    };
  }

  /** BullMQ connection (Redis-backed queues). */
  static forBullmq(): DynamicModule {
    return {
      module: RepositoryModule,
      imports: [
        BullModule.forRootAsync({
          imports: [ConfigModule],
          inject: [ConfigService],
          useFactory: bullmqModuleFactory,
        }),
      ],
      exports: [BullModule],
    };
  }
}
