-- for schemas

-- CREATE SCHEMA IF NOT EXISTS presentation;

-- GRANT ALL ON SCHEMA presentation TO postgres;

-- GRANT USAGE ON SCHEMA presentation TO admin;
-- ALTER DEFAULT PRIVILEGES IN SCHEMA presentation GRANT ALL PRIVILEGES ON TABLES TO admin;

-- GRANT USAGE ON SCHEMA presentation TO readonly;
-- ALTER DEFAULT PRIVILEGES IN SCHEMA presentation GRANT SELECT ON TABLES TO readonly;

-- component schema tables

CREATE TABLE types.component_schema (
    id SERIAL PRIMARY KEY,
    url_name VARCHAR(64) NOT NULL UNIQUE, -- Component.svelte
    ui_name VARCHAR(64) NOT NULL, -- Component
    json_ref TEXT NOT NULL, -- /path/to/Component.svelte.json
    CONSTRAINT unique_component_entry UNIQUE (url_name, ui_name, json_ref)
);

CREATE TABLE types.template_schema (
    id SERIAL PRIMARY KEY,
    url_name VARCHAR(64) NOT NULL UNIQUE, -- Template.svelte
    ui_name VARCHAR(64) NOT NULL, -- Template 
    json_ref TEXT NOT NULL,
    CONSTRAINT unique_template_entry UNIQUE (url_name, ui_name, json_ref)-- /path/to/Component.svelte.json
);

CREATE TABLE types.segment_schema (
    id SERIAL PRIMARY KEY,
	template_schema_id INT NOT NULL REFERENCES types.template_schema(id) ON DELETE CASCADE, 
    json_preset JSON NOT NULL
    -- { type: object, name: segment_name properties: { template: { $ref: template_path }, components: { type: object, properties: { component_foo: { $ref: component_path }, ...}}
    -- nested or flat properties
    -- { type: object, name: segment_name properties: { template: { $ref: template_path }, component_foo: { $ref: component_path }, ...}
);

CREATE TABLE presentation.segment_instance (
    id SERIAL PRIMARY KEY,
    prototype_segment_id INT NOT NULL REFERENCES types.segment_schema(id) ON DELETE CASCADE, 
    json_data JSON NOT NULL
    -- { template: {align: center}, components:  {componentFoo: {text: this, url: that}, ...}}
    -- nested or flat properties
    -- { template: {align: center}, componentFoo: {text: this, url: that}, ...}
);

