import pg from 'pg';
import dotenv from 'dotenv';
dotenv.config();

const { Pool } = pg;

const god = new Pool({
    user: process.env.PG_GOD_USER,
    password: process.env.PG_GOD_PASSWORD,
    host: process.env.PG_SERVICE_HOST,
    port: process.env.PG_SERVICE_PORT,
    database: process.env.PG_SERVICE_NAME,
});
    
const admin = new Pool({
    user: process.env.PG_ADMIN_USER,
    password: process.env.PG_ADMIN_PASSWORD,
    host: process.env.PG_SERVICE_HOST,
    port: process.env.PG_SERVICE_PORT,
    database: process.env.PG_SERVICE_NAME,
});

const readonly = new Pool({
    user: process.env.PG_READONLY_USER,
    password: process.env.PG_READONLY_PASSWORD,
    host: process.env.PG_SERVICE_HOST,
    port: process.env.PG_SERVICE_PORT,
    database: process.env.PG_SERVICE_NAME,
});

export { god, admin, readonly };
