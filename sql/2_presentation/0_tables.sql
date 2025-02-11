CREATE TABLE presentation.route_layout_type (
    id SERIAL PRIMARY KEY,
    route_id INT UNIQUE REFERENCES navigation.route(id) ON DELETE CASCADE,
    layout_id INT REFERENCES types.layout_type(id) ON DELETE CASCADE    
);

-- CREATE TABLE presentation.route_page_content (
--     id SERIAL PRIMARY KEY,
--     route_id INT UNIQUE REFERENCES navigation.route(id),
--     page_json JSON NOT NULL DEFAULT '[]'
-- );

CREATE TABLE presentation.segment_instance (
    id SERIAL PRIMARY KEY,
    segment_id INT REFERENCES types.segment_schema(id),
    segment_json JSON NOT NULL DEFAULT '{}'
);

-- CREATE TABLE presentation.route_page_content (
--     id SERIAL PRIMARY KEY,
--     route_id INT REFERENCES navigation.route(id),
--     segment_id INT REFERENCES presentation.segment_instance(id),
--     segment_order INT NOT NULL,
--     CONSTRAINT unique_segment_page UNIQUE (route_id, segment_id),
--     CONSTRAINT unique_segment_order UNIQUE (route_id, segment_order)
-- );

CREATE TABLE presentation.route_page_content (
    id SERIAL PRIMARY KEY,
    route_id INT REFERENCES navigation.route(id),
    segment_instance_id INT REFERENCES presentation.segment_instance(id),
    segment_instance_order INT NOT NULL CHECK (segment_instance_order > 0),
    CONSTRAINT unique_segment_page UNIQUE (route_id, segment_instance_id),
    CONSTRAINT unique_segment_order UNIQUE (route_id, segment_instance_order)
);