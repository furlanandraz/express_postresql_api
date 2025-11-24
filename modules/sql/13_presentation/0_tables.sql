CREATE TABLE presentation.route_layout_class (
    route_id INT NOT NULL UNIQUE REFERENCES navigation.route(id) ON DELETE CASCADE,
    layout_type_id INT NOT NULL REFERENCES prototype.layout_type(id) ON DELETE CASCADE,

    PRIMARY KEY (route_id, layout_type_id)
);

CREATE TABLE presentation.route_template_class (
    id SERIAL PRIMARY KEY, -- to make as above
    route_id INT NOT NULL REFERENCES navigation.route(id) ON DELETE CASCADE,
    template_type_id INT NOT NULL REFERENCES prototype.template_type(id) ON DELETE CASCADE,
    template_order INT NOT NULL,

    UNIQUE (route_id, template_type_id, template_order) -- to fix
);

CREATE TABLE presentation.route_topic_class (
    id SERIAL PRIMARY KEY,  -- to make as above
    route_id INT NOT NULL REFERENCES navigation.route(id) ON DELETE CASCADE,
    layout_schema_id INT NOT NULL REFERENCES prototype.layout_schema(id) ON DELETE CASCADE,

    UNIQUE (route_id, layout_schema_id)  -- to fix
);





