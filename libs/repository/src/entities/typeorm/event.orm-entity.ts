import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

/**
 * Persistence model for the Events bounded context (PostgreSQL via TypeORM).
 * This is an ORM model, NOT the domain entity — mapping happens in the app's
 * infrastructure layer.
 */
@Entity({ name: 'events' })
export class EventOrmEntity {
  @PrimaryGeneratedColumn('uuid')
  id?: string;

  @Index()
  @Column({ type: 'varchar', length: 120 })
  source?: string;

  @Index()
  @Column({ type: 'varchar', length: 80 })
  type?: string;

  @Column({ type: 'varchar', length: 20, default: 'info' })
  severity?: string;

  @Column({ type: 'jsonb', default: {} })
  payload?: Record<string, unknown>;

  @CreateDateColumn({ type: 'timestamptz' })
  occurredAt?: Date;

  @UpdateDateColumn({ type: 'timestamptz' })
  updatedAt?: Date;
}
