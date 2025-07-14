import { god } from "#clients";
import pgError2HttpStatus from "#DAO/functions/formatters/pgError2HttpStatus.js";

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

    static async update(data, inheritedClient) {

        const client = inheritedClient || await god.connect();
        let hasError = false;

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

        const updateCurrentNext = `
        UPDATE
            navigation.route
        SET
            prev_id = $1::int
        WHERE
            id = $2::int;
        `;

        const updatePrev = `
        UPDATE
            navigation.route
        SET
            next_id = $1::int
        WHERE
            id = $2::int;
        `;

        const paramsPrev = [data.id, data.prev_id];
        
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
            if (!inheritedClient) await client.query('BEGIN');
            let current = await client.query(selectCurrent, [data.id]);
            current = current.rows[0];

            await client.query(updateCurrentNext, [current?.prev_id, current?.next_id]);
            await client.query(updateCurrentPrev, [current?.next_id, current?.prev_id]);
            
            if (data.prev_id !== null) await client.query(updatePrev, paramsPrev);
            if (data.next_id !== null) await client.query(updateNext, paramsNext);

            const result = await client.query(update, params);
            
            if (!inheritedClient) await client.query('COMMIT');
            return { rows: result.rows };
        } catch (error) {
            hasError = true;
            return pgError2HttpStatus(error, 'Route.update()');
        } finally {
            if (!inheritedClient) {
                if (hasError) await client.query('ROLLBACK');
                client.release();
            }
        }
        
    }

    static async insert(data, inheritedClient = null) {

        const client = inheritedClient || await god.connect();
        let hasError = false;

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
            if (!inheritedClient) await client.query('BEGIN');
            const result = await client.query(insert, params);
            await Route.update({ id: result.rows[0].id, ...data }, client);
            if (!inheritedClient) await client.query('COMMIT');
            return {rows: result.rows};
        } catch (error) {
            console.error(error);
            hasError = true;
            return pgError2HttpStatus(error, 'Route.insert()');
        } finally {
            if (!inheritedClient) {
                if (hasError) await client.query('ROLLBACK');
                client.release();
            }
        }
    }

    static async delete(id, inheritedClient) {

        const client = inheritedClient || await god.connect();
        let hasError = false;

        const select = `
        SELECT
            prev_id,
            next_id
        FROM
            navigation.route
        WHERE
            id = $1::int;
        `;

        const updatePrev = `
        UPDATE
            navigation.route
        SET
            next_id = $1::int
        WHERE
            id = $2::int;
        `;

        const updateNext = `
        UPDATE
            navigation.route
        SET
            prev_id = $1::int
        WHERE
            id = $2::int;
        `;

        const del = `
        DELETE FROM
            navigation.route
        WHERE
            id = $1::int
        RETURNING
            id;
        `;

        try {
            if (!inheritedClient) await client.query('BEGIN');
            let current = await client.query(select, [id]);
            current = current.rows[0];
            await client.query(del, [id])
            await client.query(updateNext, [current?.prev_id, current?.next_id]);
            const result = await client.query(updatePrev, [current?.next_id, current?.prev_id]);
            if (!inheritedClient) await client.query('COMMIT');
            return {rows: result.rows};
        } catch (error) {
            console.log(error)
            hasError = true;
            return pgError2HttpStatus(error, 'Route.delete()');
        } finally {
            if (!inheritedClient) {
                if (hasError) await client.query('ROLLBACK');
                client.release();
            }
        }
    }
}

export default Route;