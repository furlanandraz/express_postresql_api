CREATE TABLE navigation.route (
    id SERIAL PRIMARY KEY,
    parent_id INT REFERENCES navigation.route(id) ON DELETE CASCADE, -- possible DEFAULT 1
    prev_id INT REFERENCES navigation.route(id) UNIQUE,
    next_id INT REFERENCES navigation.route(id) UNIQUE,
    render_type route_render_type NOT NULL DEFAULT 'page',
    render_method route_render_method NOT NULL DEFAULT 'SSR',
    label TEXT NOT NULL
);

