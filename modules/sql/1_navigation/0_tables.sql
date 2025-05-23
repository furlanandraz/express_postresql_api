CREATE TABLE navigation.route (
    id SERIAL PRIMARY KEY,
    parent_id INT REFERENCES navigation.route(id) ON DELETE CASCADE,
    url_uuid UUID DEFAULT gen_random_uuid() UNIQUE,
    url_name TEXT NOT NULL UNIQUE,
    title TEXT NOT NULL,
    meta_description TEXT,
    meta_keywords TEXT,
    url_type types.route_url_type DEFAULT 'static',
    render_method types.route_render_method DEFAULT 'SSR'
);

-- here the url_name TEXT NOT NULL UNIQUE, is not correct. must allow for /foo/foo just not on the same level

CREATE UNIQUE INDEX idx_route_parent_id_unique ON navigation.route (parent_id)
WHERE parent_id IS NULL;

CREATE TABLE navigation.url_primary (
    id SERIAL PRIMARY KEY,
    url_uuid UUID NOT NULL UNIQUE,
    full_url TEXT NOT NULL UNIQUE,
    breadcrumbs JSONB NOT NULL UNIQUE
);



