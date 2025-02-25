CREATE TABLE presentation.route_layout_instance (
    id SERIAL PRIMARY KEY,
    route_id INT UNIQUE REFERENCES navigation.route(id) ON DELETE CASCADE,
    layout_type_id INT REFERENCES types.layout_type(id) ON DELETE CASCADE,
    json_data JSON NOT NULL DEFAULT '{}'
);



CREATE TABLE presentation.route_template_instance (
    id SERIAL PRIMARY KEY,
    route_id INT REFERENCES navigation.route(id) ON DELETE CASCADE,
    template_type_id INT REFERENCES types.template_type(id) ON DELETE CASCADE,
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

