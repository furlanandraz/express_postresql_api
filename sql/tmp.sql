CREATE DATABASE cms
    WITH
    OWNER = postgres
    ENCODING = 'UTF8'
    LC_COLLATE = 'en_US.UTF-8'
    LC_CTYPE = 'en_US.UTF-8'
    TABLESPACE = pg_default
    CONNECTION LIMIT = -1
    IS_TEMPLATE = False
    TEMPLATE = template0;

GRANT TEMPORARY, CONNECT ON DATABASE cms TO PUBLIC;

GRANT ALL ON DATABASE cms TO postgres;

\c cms


DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_roles WHERE rolname = 'admin') THEN
        CREATE ROLE admin WITH LOGIN PASSWORD 'admin';
    END IF;

    IF NOT EXISTS (SELECT 1 FROM pg_roles WHERE rolname = 'customer') THEN
        CREATE ROLE customer WITH LOGIN PASSWORD 'customer';
    END IF;

    IF NOT EXISTS (SELECT 1 FROM pg_roles WHERE rolname = 'readonly') THEN
        CREATE ROLE readonly WITH LOGIN PASSWORD 'readonly';
    END IF;
END $$;



-- Drop the public schema if it exists

DROP SCHEMA IF EXISTS public;

-- SCHEMA: admin

-- CREATE SCHEMA IF NOT EXISTS admin;

-- GRANT ALL ON SCHEMA admin TO postgres;

-- GRANT USAGE ON SCHEMA admin TO admin;
-- ALTER DEFAULT PRIVILEGES IN SCHEMA admin GRANT ALL PRIVILEGES ON TABLES TO admin;

-- SCHEMA: navigation

CREATE SCHEMA IF NOT EXISTS navigation;

GRANT ALL ON SCHEMA navigation TO postgres;

GRANT USAGE ON SCHEMA navigation TO admin;
ALTER DEFAULT PRIVILEGES IN SCHEMA navigation GRANT ALL PRIVILEGES ON TABLES TO admin;

GRANT USAGE ON SCHEMA navigation TO readonly;
ALTER DEFAULT PRIVILEGES IN SCHEMA navigation GRANT SELECT ON TABLES TO readonly;

-- SCHEMA: customer

-- CREATE SCHEMA IF NOT EXISTS customer;

-- GRANT ALL ON SCHEMA customer TO postgres;

-- GRANT USAGE ON SCHEMA customer TO admin;
-- ALTER DEFAULT PRIVILEGES IN SCHEMA customer GRANT ALL PRIVILEGES ON TABLES TO admin;

-- GRANT USAGE ON SCHEMA customer TO customer;
-- ALTER DEFAULT PRIVILEGES IN SCHEMA customer GRANT SELECT, INSERT, UPDATE, DELETE ON TABLES TO customer;

-- SCHEMA: settings

-- CREATE SCHEMA IF NOT EXISTS settings;

-- GRANT ALL ON SCHEMA settings TO postgres;
-- ALTER DEFAULT PRIVILEGES IN SCHEMA settings GRANT ALL PRIVILEGES ON TABLES TO admin;

-- SCHEMA: cache

CREATE SCHEMA IF NOT EXISTS cache;

GRANT ALL ON SCHEMA cache TO postgres;

GRANT USAGE ON SCHEMA cache TO readonly;
ALTER DEFAULT PRIVILEGES IN SCHEMA cache GRANT SELECT ON TABLES TO readonly;

-- SCHEMA: types

CREATE SCHEMA IF NOT EXISTS types;

GRANT USAGE ON SCHEMA types TO public;
GRANT ALL ON SCHEMA types TO postgres;

-- SCHEMA: presentation

CREATE SCHEMA IF NOT EXISTS presentation;

GRANT ALL ON SCHEMA presentation TO postgres;

GRANT USAGE ON SCHEMA presentation TO admin;
ALTER DEFAULT PRIVILEGES IN SCHEMA presentation GRANT ALL PRIVILEGES ON TABLES TO admin;

GRANT USAGE ON SCHEMA presentation TO readonly;
ALTER DEFAULT PRIVILEGES IN SCHEMA presentation GRANT SELECT ON TABLES TO readonly;
-- CREATE TYPE types.route_type AS ENUM ('static', 'dynamic', 'Anchor');
CREATE TYPE types.route_url_type AS ENUM ('static', 'dynamic');
CREATE TYPE types.route_render_method AS ENUM ('SSR', 'SSG', 'CSR');

-- component schema table

CREATE TABLE types.component_type (
    id SERIAL PRIMARY KEY,
    url_name VARCHAR(64) NOT NULL UNIQUE, -- Component.svelte
    ui_name VARCHAR(64) NOT NULL, -- Component
    json_ref TEXT NOT NULL, -- /path/to/Component.svelte.json
    CONSTRAINT unique_component_entry UNIQUE (url_name, ui_name, json_ref)
);

-- template schema table

CREATE TABLE types.template_type (
    id SERIAL PRIMARY KEY,
    url_name VARCHAR(64) NOT NULL UNIQUE, -- Template.svelte
    ui_name VARCHAR(64) NOT NULL, -- Template 
    json_ref TEXT NOT NULL, -- /path/to/Component.svelte.json
    CONSTRAINT unique_template_entry UNIQUE (url_name, ui_name, json_ref)
);

-- segment schema table + form ready json schema

CREATE TABLE types.template_schema (
    id SERIAL PRIMARY KEY,
	template_type_id INT NOT NULL REFERENCES types.template_type(id) ON DELETE CASCADE, 
    json_preset JSON NOT NULL,
    json_form JSON NOT NULL DEFAULT '{}'
);

-- layouts 

CREATE TABLE types.layout_type (
    id SERIAL PRIMARY KEY,
    url_name VARCHAR(64) NOT NULL UNIQUE,
    ui_name VARCHAR(64) NOT NULL,
    CONSTRAINT unique_layout_entry UNIQUE (url_name, ui_name)
);

CREATE TABLE types.layout_schema (
    id SERIAL PRIMARY KEY,
	layout_type_id INT NOT NULL REFERENCES types.layout_type(id) ON DELETE CASCADE, 
    json_preset JSON NOT NULL,
    json_form JSON NOT NULL DEFAULT '{}'
);
CREATE OR REPLACE FUNCTION types.update_template_schema ()
RETURNS TRIGGER
LANGUAGE plpgsql AS $update_template_schema$
DECLARE
    payload TEXT;
BEGIN
    payload := json_build_object('id', NEW.id)::TEXT;
    PERFORM pg_notify('update_template_schema', payload);
    RETURN NEW;
END;
$update_template_schema$;
CREATE OR REPLACE TRIGGER set_json_form
AFTER INSERT OR UPDATE ON types.template_schema
FOR EACH ROW
EXECUTE FUNCTION types.update_template_schema();

CREATE TABLE navigation.route (
    id SERIAL PRIMARY KEY,
    parent_id INT REFERENCES navigation.route(id) ON DELETE CASCADE,
    url_name TEXT NOT NULL UNIQUE,
    ui_name TEXT NOT NULL,
    meta_description TEXT,
    meta_keywords TEXT,
    url_type types.route_url_type DEFAULT 'static',
    render_method types.route_render_method DEFAULT 'SSR'   
);

CREATE UNIQUE INDEX unique_root ON navigation.route (parent_id)
WHERE parent_id IS NULL;

CREATE OR REPLACE FUNCTION navigation.route_change()
RETURNS TRIGGER
LANGUAGE plpgsql AS $route_change$
DECLARE
BEGIN
	RAISE NOTICE 'MENU CHANGED';
    PERFORM pg_notify('route_change', '{"payload": "nothing"}');
    RETURN NULL;
END;
$route_change$;

-- "Anchor" url type removed until further development

-- CREATE OR REPLACE FUNCTION navigation.check_anchor_parent_static() 
-- RETURNS TRIGGER
-- LANGUAGE plpgsql AS $check_anchor_parent_static$
-- BEGIN
--     IF NEW.route_type = 'Anchor' AND (NEW.parent_id IS NOT NULL) THEN
--         IF (SELECT route_type FROM navigation.route WHERE id = NEW.parent_id) != 'static' THEN
--             RAISE EXCEPTION 'Parent route_type must be "static" for "Anchor" items';
--         END IF;
--     END IF;
--     RETURN NEW;
-- END;
-- $check_anchor_parent_static$;
CREATE OR REPLACE TRIGGER route_change_trigger
AFTER INSERT OR UPDATE OR DELETE ON navigation.route
FOR EACH STATEMENT
EXECUTE PROCEDURE navigation.route_change();

-- CREATE TRIGGER check_anchor_parent_static_trigger
-- AFTER INSERT OR UPDATE OR DELETE ON navigation.route
-- FOR EACH STATEMENT
-- EXECUTE PROCEDURE navigation.check_anchor_parent_static();
INSERT INTO navigation.route (
    id,
    parent_id,
    url_name,
    ui_name,
    meta_description,
    meta_keywords
) VALUES (
    1,
    NULL,
    '',
    'Home',
    'Homepage for my CMS',
    'CMS, website, home'
);
CREATE TABLE presentation.route_layout_instance (
    id SERIAL PRIMARY KEY,
    route_id INT UNIQUE REFERENCES navigation.route(id) ON DELETE CASCADE,
    layout_instance_id INT REFERENCES types.layout_type(id) ON DELETE CASCADE,
    json_data JSON NOT NULL DEFAULT '{}'
);



CREATE TABLE presentation.route_template_instance (
    id SERIAL PRIMARY KEY,
    route_id INT REFERENCES navigation.route(id) ON DELETE CASCADE,
    template_instance_id INT REFERENCES presentation.template_instance(id) ON DELETE CASCADE,
    template_instance_order INT NOT NULL CHECK (template_instance_order > 0),
    json_data JSON NOT NULL DEFAULT '{}',
    CONSTRAINT unique_route_order UNIQUE (route_id, template_instance_order)
);

-- CREATE TABLE presentation.route_template_instance (
--     id SERIAL PRIMARY KEY,
--     route_id INT UNIQUE REFERENCES navigation.route(id),
--     page_json JSON NOT NULL DEFAULT '[]'
-- );

-- CREATE TABLE presentation.template_instance (
--     id SERIAL PRIMARY KEY,
--     segment_id INT REFERENCES types.template_schema(id),
--     segment_json JSON NOT NULL DEFAULT '{}'
-- );

-- CREATE TABLE presentation.route_template_instance (
--     id SERIAL PRIMARY KEY,
--     route_id INT REFERENCES navigation.route(id),
--     segment_id INT REFERENCES presentation.template_instance(id),
--     segment_order INT NOT NULL,
--     CONSTRAINT unique_segment_page UNIQUE (route_id, segment_id),
--     CONSTRAINT unique_segment_order UNIQUE (route_id, segment_order)
-- );



CREATE TABLE cache.navigation_cache (
    id SERIAL PRIMARY KEY,
    cache_name TEXT UNIQUE NOT NULL,
    cache_json JSON NOT NULL,
    cache_timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
CREATE OR REPLACE FUNCTION cache.update_timestamp()
RETURNS TRIGGER
LANGUAGE plpgsql AS $update_timestamp$
BEGIN
    NEW.cache_timestamp = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$update_timestamp$;
CREATE OR REPLACE TRIGGER set_updated_at
BEFORE UPDATE ON cache.navigation_cache
FOR EACH ROW
EXECUTE FUNCTION cache.update_timestamp();
-- CREATE VIEW navigation.route_layout_page AS
-- SELECT
--     r.id,
--     r.parent_id,
--     r.url_name,
--     r.ui_name,
--     r.meta_description,
--     r.meta_keywords,
--     r.url_type,
--     r.render_method,
--     COALESCE(rl.layout_id, NULL) AS layout_id,
--     COALESCE(rp.id, NULL) AS page_id
-- FROM
--     navigation.route r
-- LEFT JOIN
--     presentation.route_layout_type rl
-- ON
--     r.id = rl.route_id
-- LEFT JOIN
--     presentation.route_template_instance rp
-- ON
--     r.id = rp.route_id;

-- CREATE VIEW presentation.route_page_segment_type AS
-- SELECT
--     rpc.route_id,
--     rpc.template_instance_order,
--     si.id
--     si.segment_json,
--     tt.url_name
-- FROM presentation.route_template_instance rpc
-- LEFT JOIN presentation.template_instance si 
--     ON rpc.template_instance_id = si.id
-- LEFT JOIN types.template_schema ss 
--     ON si.segment_id = ss.id
-- LEFT JOIN types.template_type tt 
--     ON ss.template_type_id = tt.id
-- ORDER BY rpc.template_instance_order ASC;

-- CREATE VIEW presentation.route_layout_type_url AS
-- SELECT
--     rl.route_id,
-- 	lt.url_name
-- FROM presentation.route_layout_type rl
-- LEFT JOIN types.layout_type lt 
--     ON rl.layout_id = lt.id;
-- INSERT INTO navigation.route (
--     id,
--     parent_id,
--     url_name,
--     ui_name,
--     meta_description,
--     meta_keywords
-- ) VALUES (
--     2,
--     1,
--     'contact',
--     'contact',
--     'Ask me anything about my CMS',
--     'CMS, FAQ'
-- ), (
--     3,
--     1,
--     'about',
--     'About',
--     'Ask me anything about my CMS',
--     'CMS, FAQ'
-- ), (
--     4,
--     1,
--     'services',
--     'Services',
--     'Other services',
--     ''
-- ), (
--     5,
--     4,
--     'plumbing',
--     'Plumbing',
--     '',
--     ''
-- ), (
--     6,
--     4,
--     'wiring',
--     'Wiring',
--     '',
--     ''
-- );

------ npm run init:types

-- INSERT INTO types.template_schema (
--     id,
--     template_type_id,
--     json_preset
-- ) VALUES (
--     1,
--     1,
--     '{"type":"object","properties":{"template":{"template_id":1},"components":{"type":"object","title":"Components","properties":{"buttonLinkPrimary":{"component_id":1},"buttonLinkSecondary":{"component_id":1},"title":{"component_id":4},"figure":{"component_id":2},"paragraph":{"component_id":5}}}}}'
-- );

------ npm run render

-- INSERT INTO presentation.template_instance (
--     id,
--     segment_id,
--     segment_json
-- ) VALUES (
--     1,
--     1,
--     '{"template":{"align":"left","background":true},"components":{"buttonLinkPrimary":{"variant":"primary","text":"Hello","href":"www.google.com"},"buttonLinkSecondary":{"variant":"secondary","text":"Bye","href":"www.facebook.com"},"title":{"largeTitle":"Large Title","smallTitle":"Small title"},"figure":{"figcaption":"Figure Caption helo from rjsf"},"paragraph":{"description":"Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur."}}}'
-- );

-- INSERT INTO presentation.route_template_instance (
--     id,
--     route_id,
--     template_instance_id,
--     template_instance_order
-- ) VALUES (
--     1,
--     1,
--     1,
--     1
-- );

-- INSERT INTO presentation.route_layout_type (
--     id,
--     route_id,
--     layout_id
-- ) VALUES (
--     1,
--     1,
--     1
-- ), (
--     2,
--     4,
--     2
-- );

