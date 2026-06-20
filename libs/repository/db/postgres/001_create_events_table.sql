-- =====================================================================
-- Events bounded context (PostgreSQL)
-- Objetos de BD creados por script SQL (sin migraciones de TypeORM).
-- Idempotente: puede re-ejecutarse sin error.
-- =====================================================================

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE IF NOT EXISTS events (
    id            UUID         PRIMARY KEY DEFAULT uuid_generate_v4(),
    source        VARCHAR(120) NOT NULL,
    type          VARCHAR(80)  NOT NULL,
    severity      VARCHAR(20)  NOT NULL DEFAULT 'info',
    payload       JSONB        NOT NULL DEFAULT '{}'::jsonb,
    "occurredAt"  TIMESTAMPTZ  NOT NULL DEFAULT now(),
    "updatedAt"   TIMESTAMPTZ  NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_events_source ON events (source);
CREATE INDEX IF NOT EXISTS idx_events_type   ON events (type);
