// ---- Module ----
export * from './repository.module';

// ---- Base repositories (Repository pattern) ----
export * from './base/base-repository.interface';
export * from './base/typeorm-base.repository';
export * from './base/mongoose-base.repository';

// ---- Entities / ORM models ----
export * from './entities/mongoose/event.schema';
export * from './entities/mongoose/alert.schema';
export * from './entities/redis/alert.redis-entity';

// ---- Queues (BullMQ) ----
export * from './queues/event-incident.queue';

// ---- Connection management ----
export * from './connection/typeorm.config';
export * from './connection/mongoose.config';
export * from './connection/cache.config';
export * from './connection/bullmq.config';

// ---- Transaction management ----
export * from './transaction/transaction.manager';

// ---- Caching layer ----
export * from './cache/cache.service';

// ---- Query builders ----
export * from './query-builders/event-query.builder';

// ---- Pagination ----
export * from './pagination/paginated-result';

// ---- Seeding ----
export * from './seeding/incident.seeder';
