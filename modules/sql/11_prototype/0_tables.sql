-- component type

CREATE TABLE prototype.component_type (
    id SERIAL PRIMARY KEY,
    slug VARCHAR(64) NOT NULL UNIQUE, -- Component.svelte
    title VARCHAR(64) NOT NULL UNIQUE, -- Component
    base JSONB NOT NULL -- admin generated schema
);

-- template type

CREATE TABLE prototype.template_type (
    id SERIAL PRIMARY KEY,
    slug VARCHAR(64) NOT NULL UNIQUE, -- Template.svelte
    title VARCHAR(64) NOT NULL UNIQUE, -- Template
    base JSONB NOT NULL -- admin generated schema
);

-- template schema

CREATE TABLE prototype.template_schema (
    id SERIAL PRIMARY KEY,
	template_type_id INT NOT NULL REFERENCES prototype.template_type(id) ON DELETE CASCADE, 
    reference JSON NOT NULL,
    form JSON NOT NULL DEFAULT '{}'
);

-- layout type

CREATE TABLE prototype.layout_type (
    id SERIAL PRIMARY KEY,
    slug VARCHAR(64) NOT NULL UNIQUE, -- Layout.svelte
    title VARCHAR(64) NOT NULL UNIQUE, -- Layout
    base JSONB NOT NULL -- admin generated schema
);

-- layout schema

CREATE TABLE prototype.layout_schema (
    id SERIAL PRIMARY KEY,
	template_type_id INT NOT NULL REFERENCES prototype.layout_type(id) ON DELETE CASCADE, 
    reference JSON NOT NULL,
    form JSON NOT NULL DEFAULT '{}'
);