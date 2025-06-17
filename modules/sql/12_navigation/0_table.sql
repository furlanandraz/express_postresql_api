CREATE TABLE navigation.route (
    id SERIAL PRIMARY KEY,
    parent_id INT REFERENCES navigation.route(id) ON DELETE CASCADE,
    render_type route_render_type NOT NULL DEFAULT 'page',
    render_method route_render_method NOT NULL DEFAULT 'SSR',
    label TEXT NOT NULL
);

