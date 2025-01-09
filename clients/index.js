import pg from 'pg';  // Default import for a CommonJS module
const { Pool } = pg;

const god = new Pool({
        user: 'postgres',
        password: 'furlanandraz',
        host: 'localhost',
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

const readonly = new Pool({
    user: 'client',
    password: 'client',
    host: 'localhost',
    port: 5432,
    database: 'express_postgres_api',
});

export { god, admin, customer, readonly };
// export default clients = {
//     'god': god,
//     'admin': admin
// }
