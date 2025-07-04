import { god } from "#clients";


import rows2insert from "#DAO/functions/transformers/rows2insert.js";
import rows2update from "#DAO/functions/transformers/rows2update.js";

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
            return result;
        } catch (error) {
            return {
                error: 'Database query error',
                details: {
                    method: 'Route.select()' 
                }
            }
        }
    }

    static async update(data) {

        const selectCurrent = `
        SELECT
            parent_id,
            prev_id,
            next_id
        FROM
            navigation.route
        WHERE
            id = $1::int;
        `;

        const updateCurrentPrev = `
        UPDATE
            navigation.route
        SET
            next_id = $1::int
        WHERE
            id = $2::int;
        `;

        const paramsCurrentPrev = [data.next_id, data.prev_id];

        const updateCurrentNext = `
        UPDATE
            navigation.route
        SET
            prev_id = $1::int
        WHERE
            id = $2::int;
        `;

        const paramsCurrentNext = [data.prev_id, data.next_id];

        const updatePrev = `
        UPDATE
            navigation.route
        SET
            next_id = $1::int
        WHERE
            id = $2::int;
        `;

        const paramsPrev = [data.id, data.prev_id,];
        
        const updateNext = `
        UPDATE
            navigation.route
        SET
            prev_id = $1::int
        WHERE
            id = $2::int;
        `;
        const paramsNext = [data.id, data.next_id];

        const update = `
        UPDATE
            navigation.route
        SET
            parent_id = $2::int,
            prev_id = $3::int,
            next_id = $4::int,
            render_type = $5::route_render_type,
            render_method = $6::route_render_method
        WHERE
            id = $1::int
        RETURNING * ;
        `;

        const params = [data.id, data.parent_id, data.prev_id, data.next_id, data.render_type, data.render_method];

        try {
            await god.query('BEGIN');
            const current = await god.query(selectCurrent, [data.id]);
            if (current.rows[0].parent_id !== data.parent_id) {
                await god.query(updateCurrentPrev, paramsCurrentPrev);
                await god.query(updateCurrentNext, paramsCurrentNext);
            }
            if (data.prev_id !== null) await god.query(updatePrev, paramsPrev);
            if (data.next_id !== null) await god.query(updateNext, paramsNext);
            const result = await god.query(update, params);
            await god.query('COMMIT');
            return {rows: result.rows};
        } catch (error) {
            console.log(error);
            await god.query('ROLLBACK');
            return {
                error: 'Database query error',
                details: {
                    method: 'Route.update()' 
                }
            }
        }
    }

    static async insert(data) {

        const insert = `
        INSERT INTO navigation.route (
            parent_id,
            prev_id,
            next_id,
            render_type,
            render_method   
        ) VALUES (
            $1::int,
            $2::int,
            $3::int,
            $4::route_render_type,
            $5::route_render_method
        )
        RETURNING * ;`;

        const params = [data.parent_id, null, null, data.render_type, data.render_method];
        
        try {
            const result = await god.query(insert, params);
            await Route.update({ id: result.rows[0].id, ...data });
            return {rows: result.rows};
        } catch (error) {
            console.log(error);
            return {
                error: 'Database query error',
                details: {
                    method: 'Route.insert()' 
                }
            }
        }
    }

    /*
    static async update(data) {
        
        const query = `
        UPDATE
            navigation.route
        SET
           parent_id = $1::int,
           render_type = $2::route_render_type,
           render_method = $3::route_render_method
        WHERE id = $4
        RETURNING *;`;

        const params = [
            data.parent_id,
            data.render_type,
            data.render_method,
            data.id
        ];
         
        
        try {
            const result = await god.query(query, params);
            return {rows: result.rows};
        } catch (error) {
            if (error.code === 'P0001') {
                return {
                    error: 'Business rule violation',
                    status: 422,
                    details: {
                        method: 'Route.update()',
                        ...(error.message ? {message: error.message} : {})
                    }
                }
            }
            return {
                error: 'Database query error',
                details: {
                    method: 'Route.update()',
                    ...(error.message ? {message: error.message} : {})
                }
            }
        }
    }
    */
    
}

export default Route;