import { god } from "#DAO/clients/index.js";
import Route from '#DAO/primitive/navigation/Route.js';
import RouteTranslation from '#DAO/primitive/language/RouteTranslation.js';
import pgError2HttpStatus from "#DAO/functions/formatters/pgError2HttpStatus.js";
import routeItemNormalize from '#DAO/functions/formatters/routeItemNormalize.js';
import resourceRouteItemURL from "#DAO/functions/builders/resourceRouteItemURL.js";

class RouteItem {

    static async select(id = null, normalize = false) {

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
            if (normalize && result.rows) {
                
                return {rows: routeItemNormalize(result.rows)};
            }
            return result;
        } catch (error) {
            console.error(error);
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
            console.log('insert', id);
            const transation = await RouteTranslation.insert(id, [...data.route_translation], client);
            if (transation.error) return transation;
            
            await client.query('COMMIT');
            await RouteItem.generateURL(id, client);
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
            await client.query('COMMIT');
            await RouteItem.generateURL(data.id, client);
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
            console.log('generateURL', generateURL);
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

    static async selectSimple(id = null) {

        let query = `
        SELECT
            *
        FROM
            public.route_item_simple ris;`
        ;
        
        const params = [];
        if (id) {
            params.push(id);
            query += ' WHERE ris.id = $1';
        };


        try {
            const result = await god.query(query, params);
            return result;
        } catch (error) {
            return {
                error: 'Database query error',
                details: {
                    method: 'RouteItem.selectSimple()' 
                }
            };
        }
    }

    select

}

export default RouteItem;