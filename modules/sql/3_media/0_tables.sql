CREATE TABLE media.image (
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    tags JSONB NOT NULL DEFAULT '[]'
);

CREATE UNIQUE INDEX idx_image_name ON media.image (name);