import { Global, Module } from '@nestjs/common';
import { HttpCrudService } from './http/http-crud.service';

/**
 * Cross-cutting utilities shared across the apps in the monorepo.
 * Currently exposes the axios-based {@link HttpCrudService}.
 */
@Global()
@Module({
  providers: [HttpCrudService],
  exports: [HttpCrudService],
})
export class SharedModule {}
