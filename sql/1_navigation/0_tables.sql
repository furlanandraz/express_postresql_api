CREATE TABLE navigation.route (
    id SERIAL PRIMARY KEY,
    parent_id INT REFERENCES navigation.route(id) ON DELETE CASCADE,
    url_uuid UUID DEFAULT gen_random_uuid() UNIQUE,
    url_name TEXT NOT NULL UNIQUE,
    ui_name TEXT NOT NULL,
    meta_description TEXT,
    meta_keywords TEXT,
    url_type types.route_url_type DEFAULT 'static',
    render_method types.route_render_method DEFAULT 'SSR'   
);

CREATE UNIQUE INDEX unique_root ON navigation.route (parent_id)
WHERE parent_id IS NULL;

CREATE TABLE navigation.url (
    id SERIAL PRIMARY KEY,
    route_url_uuid UUID REFERENCES navigation.route(url_uuid) ON DELETE CASCADE,
    topic_url_uuid UUID REFERENCES presentation.topic_instance(url_uuid) ON DELETE CASCADE,
    full_url TEXT NOT NULL,
    primary_url BOOLEAN DEFAULT TRUE,
    CHECK (route_url_uuid IS NOT NULL OR topic_url_uuid IS NOT NULL),
    CONSTRAINT unique_url_route UNIQUE(route_url_uuid, full_url),
    CONSTRAINT unique_url_topic UNIQUE(topic_url_uuid, full_url)
);

CREATE UNIQUE INDEX unique_primary_route ON navigation.url(route_url_uuid)
WHERE primary_url = TRUE;

CREATE UNIQUE INDEX unique_primary_topic ON navigation.url(topic_url_uuid)
WHERE primary_url = TRUE;

