CREATE EXTENSION IF NOT EXISTS "pgcrypto";

CREATE TABLE users (
    id            UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
    email         TEXT        NOT NULL UNIQUE,
    password_hash TEXT        NOT NULL,
    name          TEXT        NOT NULL,
    avatar_color  TEXT        NOT NULL,
    created_at    TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE households (
    id            UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
    name          TEXT        NOT NULL,
    planning_days TEXT[]      NOT NULL DEFAULT '{}',
    reminder_time TEXT        NOT NULL DEFAULT '18:00',
    created_at    TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE household_members (
    household_id UUID        NOT NULL REFERENCES households(id) ON DELETE CASCADE,
    user_id      UUID        NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    role         TEXT        NOT NULL DEFAULT 'member',
    joined_at    TIMESTAMPTZ NOT NULL DEFAULT now(),
    PRIMARY KEY (household_id, user_id)
);

CREATE TABLE invite_codes (
    id           UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
    household_id UUID        NOT NULL REFERENCES households(id) ON DELETE CASCADE,
    code         TEXT        NOT NULL UNIQUE,
    created_by   UUID        NOT NULL REFERENCES users(id),
    expires_at   TIMESTAMPTZ NOT NULL DEFAULT now() + INTERVAL '7 days',
    created_at   TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE pending_invites (
    id             UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
    household_id   UUID        NOT NULL REFERENCES households(id) ON DELETE CASCADE,
    email_or_phone TEXT        NOT NULL,
    invited_by     UUID        NOT NULL REFERENCES users(id),
    created_at     TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX ON household_members(user_id);
CREATE INDEX ON pending_invites(household_id);
