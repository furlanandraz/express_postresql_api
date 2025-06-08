CREATE TABLE settings.language (
    code VARCHAR(2) PRIMARY KEY,
    is_default BOOLEAN NOT NULL DEFAULT FALSE,
    is_enabled BOOLEAN NOT NULL DEFAULT FALSE
);
