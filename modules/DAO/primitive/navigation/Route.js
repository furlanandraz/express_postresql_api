import { god } from "#clients";


import rows2insert from "#DAO/functions/transformers/rows2insert.js";

class Route {

    static async select(id = null) {

        let query = `
        SELECT
            *
        FROM
            navigation.route`;
        
        const params = [];
        if (id) {
            params.push(id);
            query += ' WHERE id = $1';
        };


        try {
            const result = await god.query(query, params);
            return {rows: result.rows};
        } catch (error) {
            return {
                error: 'Database query error',
                details: {
                    method: 'Route.select()' 
                }
            }
        }
    }

    static async insert(data) {

        if (!data.parent_id) data.parent_id = 1;
        
        const { columns, values } = rows2insert([data], 'navigation.route')
        
        let query = `
        INSERT INTO
            navigation.route ${columns}
        VALUES
            ${values}
        RETURNING id;`;
        
        try {
            const result = await god.query(query);
            return {rows: result.rows};
        } catch (error) {
            return {
                error: 'Database query error',
                details: {
                    method: 'Route.insert()' 
                }
            }
        }
    }

    
}

export default Route;