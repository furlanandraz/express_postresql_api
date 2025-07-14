import { god } from "#DAO/clients/index.js";

import Route from '#DAO/primitive/navigation/Route.js';
import RouteTranslation from '#DAO/primitive/language/RouteTranslation.js';

class RouteItem {

    static async select(id = null) {

        let query = `
        SELECT
            *
        FROM
            public.route_item ri`;
        
        const params = [];
        if (id) {
            params.push(id);
            query += ' WHERE ri.id = $1';
        };


        try {
            const result = await god.query(query, params);
            return result;
        } catch (error) {
            return {
                error: 'Database query error',
                details: {
                    method: 'RouteItem.select()' 
                }
            };
        }
    }

    static async insert(data) {

        const client = await god.connect();
        let hasError = false;

        try {
            await client.query('BEGIN');
            const route = await Route.insert(data, client);
            if (route.error) return route;
            const id = route.rows[0]?.id;
            const transation = await RouteTranslation.insert(id, [...data.translation], client);
            if (transation.error) return transation;
            await client.query('COMMIT');
            return route;
        } catch (error) {
            hasError = true;
            return pgError2HttpStatus(error, 'RouteItem.insert()');
        } finally {
            if (hasError) await client.query('ROLLBACK');
            client.release();
        }
    }

    static async update(data) {

        const client = await god.connect();
        let hasError = false;
        
        try {
            await client.query('BEGIN');
            const route = await Route.update(data, client);
            if (route.error) return route;
            const transation = await RouteTranslation.update(data.id, data.translation, client);
            if (transation.error) return transation;
            await client.query('COMMIT');
            return route;
        } catch (error) {
            hasError = true;
            return pgError2HttpStatus(error, 'RouteItem.update()');
        } finally {
            if (hasError) await client.query('ROLLBACK');
            client.release();
        }
    }

}

export default RouteItem;