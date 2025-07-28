import { god } from "#DAO/clients/index.js";
import Route from '#DAO/primitive/navigation/Route.js';
import RouteTranslation from '#DAO/primitive/language/RouteTranslation.js';
import pgError2HttpStatus from "#DAO/functions/formatters/pgError2HttpStatus.js";
import resourceRouteItemURL from "#DAO/functions/builders/resourceRouteItemURL.js";

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
            const url = await RouteItem.generateURL(id, client);
            if (url.error) return url;
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
            const transation = await RouteTranslation.update(data.id, data.route_translation, client);
            if (transation.error) return transation;
            const url = await RouteItem.generateURL(data.id, client);
            if (url.error) return url;
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

    static async generateURL(id = null, inheritedClient) {

        const client = inheritedClient ?? await god.connect();
        let hasError = false;

        

        try {
            if (!inheritedClient) await client.query('BEGIN');
            const generateURL = await resourceRouteItemURL(id);
            if (generateURL.error) return generateURL;
            const update = await RouteTranslation.updateURL(generateURL, client);
            if (update.error) return update;
            if (!inheritedClient) await client.query('COMMIT');
            return generateURL;
        } catch (error) {
            hasError = true;
            return pgError2HttpStatus(error, 'RouteItem.update()');
        } finally {
            if (!inheritedClient) {
                if(hasError) await client.query('ROLLBACK');
                client.release();
            }
        }
    }

}

export default RouteItem;