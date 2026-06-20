// ---- Module ----
export * from './repository.module';

// ---- Base repositories (Repository pattern) ----
export * from './base/base-repository.interface';
export * from './base/typeorm-base.repository';
export * from './base/mongoose-base.repository';
export * from './base/redis-base.repository';

// ---- Entities / ORM models ----
export * from './entities/typeorm/event.orm-entity';
export * from './entities/mongoose/incident.schema';
export * from './entities/redis/alert.redis-entity';

// ---- Connection management ----
export * from './connection/typeorm.config';
export * from './connection/mongoose.config';
export * from './connection/redis.provider';

// ---- Transaction management ----
export * from './transaction/transaction.manager';

// ---- Caching layer ----
export * from './cache/cache.service';

// ---- Query builders ----
export * from './query-builders/event-query.builder';

// ---- Seeding ----
export * from './seeding/event.seeder';
