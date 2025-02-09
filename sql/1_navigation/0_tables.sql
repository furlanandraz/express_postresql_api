CREATE TABLE navigation.route (
    id SERIAL PRIMARY KEY,
    parent_id INT REFERENCES navigation.route(id) ON DELETE CASCADE,
    url_name TEXT NOT NULL UNIQUE,
    ui_name TEXT NOT NULL,
    meta_description TEXT,
    meta_keywords TEXT,
    route_type types.route_type DEFAULT 'Static',
    route_render_method types.render_method DEFAULT 'SSR'   
);
