CREATE TABLE admin.role (
    id SERIAL PRIMARY KEY,
    name VARCHAR(16) NOT NULL
);

CREATE TABLE admin.user (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    role INT REFERENCES admin.role(id)
);

CREATE UNIQUE INDEX idx_admin_user_email ON admin.user(email);
