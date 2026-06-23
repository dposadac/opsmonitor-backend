-- =====================================================================
-- Table: Incidents
-- =====================================================================

CREATE TYPE severity_enum AS ENUM ('low', 'medium', 'high', 'critical');
CREATE TYPE status_enum  AS ENUM ('open', 'in_progress', 'resolved', 'pending');

CREATE TABLE incidents 
(
    id                      UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title                   VARCHAR(255) NOT NULL,
    description             TEXT,
    affected_app            VARCHAR(100) NOT NULL,
    severity                severity_enum NOT NULL,
    status_incident         status_enum NOT NULL DEFAULT 'pending',
    assignee                VARCHAR(100),
    created_at              TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at              TIMESTAMPTZ NULL
);

CREATE INDEX idx_incidents_status   ON incidents(status_incident);
CREATE INDEX idx_incidents_severity ON incidents(severity);
CREATE INDEX idx_incidents_app      ON incidents(affected_app);

CREATE TABLE incident_events 
(
    incident_id             UUID REFERENCES incidents(id) ON DELETE CASCADE,
    event_id                TEXT NOT NULL,
    linked_at               TIMESTAMPTZ NOT NULL DEFAULT now(),
    PRIMARY KEY (incident_id, event_id)
);