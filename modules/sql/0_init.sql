CREATE DATABASE cms
    WITH
    OWNER = postgres
    ENCODING = 'UTF8'
    LC_COLLATE = 'en_US.UTF-8'
    LC_CTYPE = 'en_US.UTF-8'
    TABLESPACE = pg_default
    CONNECTION LIMIT = -1
    IS_TEMPLATE = False
    TEMPLATE = template0;

GRANT TEMPORARY, CONNECT ON DATABASE cms TO PUBLIC;

GRANT ALL ON DATABASE cms TO postgres;

\c cms

