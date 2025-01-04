-- First, drop the database outside the transaction block
DROP DATABASE IF EXISTS express_postgres_api;

-- Then, create the new database using template0 to avoid collation conflicts
CREATE DATABASE express_postgres_api
    WITH
    OWNER = postgres
    ENCODING = 'UTF8'
    LC_COLLATE = 'en_US.UTF-8'
    LC_CTYPE = 'en_US.UTF-8'
    TABLESPACE = pg_default
    CONNECTION LIMIT = -1
    IS_TEMPLATE = False
    TEMPLATE = template0;

GRANT TEMPORARY, CONNECT ON DATABASE express_postgres_api TO PUBLIC;

GRANT ALL ON DATABASE express_postgres_api TO postgres;

-- Now, connect to the newly created database
\c express_postgres_api

-- Begin a transaction block for further operations
BEGIN;

-- Drop the public schema if it exists
DROP SCHEMA IF EXISTS public;

-- End the transaction block
COMMIT;
