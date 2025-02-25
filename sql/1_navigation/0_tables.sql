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
