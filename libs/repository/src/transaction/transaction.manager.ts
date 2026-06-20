import { Injectable } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource, EntityManager } from 'typeorm';

/**
 * Centralized transaction handling for relational (TypeORM) operations.
 * Wraps a unit of work in a single transaction and rolls back on error.
 */
@Injectable()
export class TransactionManager {
  constructor(@InjectDataSource() private readonly dataSource: DataSource) {}

  /**
   * Runs `work` inside a transaction. The callback receives a transactional
   * EntityManager that must be threaded into repository calls. Any thrown
   * error triggers an automatic rollback.
   */
  async runInTransaction<T>(
    work: (manager: EntityManager) => Promise<T>,
  ): Promise<T> {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      const result = await work(queryRunner.manager);
      await queryRunner.commitTransaction();
      return result;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }
}
