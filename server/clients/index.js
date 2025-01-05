import pg from 'pg';  // Default import for a CommonJS module
const { Pool, Client } = pg;

const god = new Pool({
    user: 'postgres',
    password: 'furlanandraz',
    host: '127.0.0.1',
    port: 5432,
    database: 'express_postgres_api',
});

const admin = new Pool({
    user: 'admin',
    password: 'admin',
    host: 'localhost',
    port: 5432,
    database: 'express_postgres_api',
});

const customer = new Pool({
    user: 'customer',
    password: 'customer',
    host: 'localhost',
    port: 5432,
    database: 'express_postgres_api',
});
    
const client = new Pool({
    user: 'client',
    password: 'client',
    host: 'localhost',
    port: 5432,
    database: 'express_postgres_api',
})

export {god, admin, customer, client};
