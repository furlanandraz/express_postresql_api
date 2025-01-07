import pg from 'pg';  // Default import for a CommonJS module
const { Pool } = pg;

const clients = {
    god: new Pool({
        user: 'postgres',
        password: 'furlanandraz',
        host: 'localhost',
        port: 5432,
        database: 'express_postgres_api',
    }),

    admin: new Pool({
        user: 'admin',
        password: 'admin',
        host: 'localhost',
        port: 5432,
        database: 'express_postgres_api',
    }),

    customer: new Pool({
        user: 'customer',
        password: 'customer',
        host: 'localhost',
        port: 5432,
        database: 'express_postgres_api',
    }),
    
    readonly: new Pool({
        user: 'client',
        password: 'client',
        host: 'localhost',
        port: 5432,
        database: 'express_postgres_api',
    }),
}

export default clients;
