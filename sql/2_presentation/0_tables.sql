CREATE TABLE presentation.route_layout_type (
    id SERIAL PRIMARY KEY,
    route_id INT UNIQUE REFERENCES navigation.route(id) ON DELETE CASCADE,
    layout_id INT REFERENCES types.layout_type(id) ON DELETE CASCADE    
);

CREATE TABLE presentation.route_page_content (
    id SERIAL PRIMARY KEY,
    route_id INT UNIQUE REFERENCES navigation.route(id),
    page_json JSON NOT NULL DEFAULT '[]'
);

CREATE TABLE presentation.page_segment_content (
    id SERIAL PRIMARY KEY,
    page_id INT REFERENCES presentation.route_page_content(id),
    segment_id INT REFERENCES types.segment_schema(id),
    segment_json JSON NOT NULL DEFAULT '{}'
);