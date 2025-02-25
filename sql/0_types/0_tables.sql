-- component schema table

CREATE TABLE types.component_type (
    id SERIAL PRIMARY KEY,
    url_name VARCHAR(64) NOT NULL UNIQUE, -- Component.svelte
    ui_name VARCHAR(64) NOT NULL, -- Component
    json_ref TEXT NOT NULL, -- /path/to/Component.svelte.json
    CONSTRAINT unique_component_entry UNIQUE (url_name, ui_name, json_ref)
);

-- template schema table

CREATE TABLE types.template_type (
    id SERIAL PRIMARY KEY,
    url_name VARCHAR(64) NOT NULL UNIQUE, -- Template.svelte
    ui_name VARCHAR(64) NOT NULL, -- Template 
    json_ref TEXT NOT NULL, -- /path/to/Component.svelte.json
    CONSTRAINT unique_template_entry UNIQUE (url_name, ui_name, json_ref)
);

-- segment schema table + form ready json schema

CREATE TABLE types.template_schema (
    id SERIAL PRIMARY KEY,
	template_type_id INT NOT NULL REFERENCES types.template_type(id) ON DELETE CASCADE, 
    json_preset JSON NOT NULL,
    json_form JSON NOT NULL DEFAULT '{}'
);

-- layouts 

CREATE TABLE types.layout_type (
    id SERIAL PRIMARY KEY,
    url_name VARCHAR(64) NOT NULL UNIQUE,
    ui_name VARCHAR(64) NOT NULL,
    CONSTRAINT unique_layout_entry UNIQUE (url_name, ui_name)
);

CREATE TABLE types.layout_schema (
    id SERIAL PRIMARY KEY,
	layout_type_id INT NOT NULL REFERENCES types.layout_type(id) ON DELETE CASCADE, 
    json_preset JSON NOT NULL,
    json_form JSON NOT NULL DEFAULT '{}'
);