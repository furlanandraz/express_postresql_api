-- for schemas

-- CREATE SCHEMA IF NOT EXISTS presentation;

-- GRANT ALL ON SCHEMA presentation TO postgres;

-- GRANT USAGE ON SCHEMA presentation TO admin;
-- ALTER DEFAULT PRIVILEGES IN SCHEMA presentation GRANT ALL PRIVILEGES ON TABLES TO admin;

-- GRANT USAGE ON SCHEMA presentation TO readonly;
-- ALTER DEFAULT PRIVILEGES IN SCHEMA presentation GRANT SELECT ON TABLES TO readonly;

-- component schema table

CREATE TABLE types.component_schema (
    id SERIAL PRIMARY KEY,
    url_name VARCHAR(64) NOT NULL UNIQUE, -- Component.svelte
    ui_name VARCHAR(64) NOT NULL, -- Component
    json_ref TEXT NOT NULL, -- /path/to/Component.svelte.json
    CONSTRAINT unique_component_entry UNIQUE (url_name, ui_name, json_ref)
);

-- template schema table

CREATE TABLE types.template_schema (
    id SERIAL PRIMARY KEY,
    url_name VARCHAR(64) NOT NULL UNIQUE, -- Template.svelte
    ui_name VARCHAR(64) NOT NULL, -- Template 
    json_ref TEXT NOT NULL, -- /path/to/Component.svelte.json
    CONSTRAINT unique_template_entry UNIQUE (url_name, ui_name, json_ref)
);

-- segment schema table + form ready json schema

CREATE TABLE types.segment_schema (
    id SERIAL PRIMARY KEY,
	template_schema_id INT NOT NULL REFERENCES types.template_schema(id) ON DELETE CASCADE, 
    json_preset JSON NOT NULL,
    json_form JSON NOT NULL DEFAULT '{}'
);

CREATE OR REPLACE FUNCTION types.update_segment_schema ()
RETURNS TRIGGER
LANGUAGE plpgsql AS $update_segment_schema$
DECLARE
    payload TEXT;
BEGIN
    payload := json_build_object('id', NEW.id)::TEXT;
    PERFORM pg_notify('update_segment_schema', payload);
    RETURN NEW;
END;
$update_segment_schema$;

CREATE OR REPLACE TRIGGER set_json_form
AFTER INSERT OR UPDATE ON types.segment_schema
FOR EACH ROW
EXECUTE FUNCTION types.update_segment_schema();

-- manually created segment schema, subsequent creations to be handled in react app

INSERT INTO types.segment_schema (
    template_schema_id,
    json_preset
) VALUES (
    1,
    '{"type":"object","properties":{"template":{"template_id":1},"components":{"type":"object","title":"Components","properties": {"buttonLinkPrimary":{"component_id":1},"buttonLinkSecondary":{"component_id":1},"title":{"component_id":4},"figure":{"component_id":3}}}}}'
);



-- CREATE TABLE presentation.segment_instance (
--     id SERIAL PRIMARY KEY,
--     prototype_segment_id INT NOT NULL REFERENCES types.segment_schema(id) ON DELETE CASCADE, 
--     json_data JSON NOT NULL
-- );


