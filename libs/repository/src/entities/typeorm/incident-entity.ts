import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity({ name: 'incidents' })
export class IncidentsOrmEntity {
    @PrimaryGeneratedColumn('uuid')
    id?: string;

    @Column({ type: 'varchar', length: 255 })
    title?: string;

    @Column({ type: 'text' })
    description?: string;

    @Index()
    @Column({ name: 'affected_app', type: 'varchar', length: 100 })
    affected_app?: string;

    @Index()
    @Column({ name: 'severity', type: 'varchar', length: 20 })
    severity!: string;

    @Index()
    @Column({ name: 'status_incident', type: 'varchar', length: 50 })
    status_incident!: string;

    @Column({ name: 'assignee', type: 'varchar', length: 50 })
    assignee?: string;

    @CreateDateColumn({ type: 'timestamptz' })
    created_at?: Date;

    @UpdateDateColumn({ type: 'timestamptz' })
    updated_at?: Date;
}
