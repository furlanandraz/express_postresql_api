CREATE TABLE settings.schema_showing_order (
    id SERIAL PRIMARY KEY,
    display_order INT NOT NULL,
    schema_name TEXT UNIQUE NOT NULL,
    ui_name TEXT
);