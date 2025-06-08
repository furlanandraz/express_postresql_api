CREATE TABLE auth.role (
    id SERIAL PRIMARY KEY,
    name VARCHAR(16) UNIQUE NOT NULL,
    permission_view JSONB DEFAULT '[]',
    permission_edit JSONB DEFAULT '[]'
);

CREATE TABLE auth.user (
    id SERIAL PRIMARY KEY,
    role INT NOT NULL REFERENCES auth.role(id),
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL, -- bycript 12 rounds
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);


