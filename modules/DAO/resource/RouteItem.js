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

        try {
            const route = await Route.insert({...data});
            if (route.error) return route;
            const id = route.rows[0]?.id;
            const transation = await RouteTranslation.insert(id, [...data.translation]);
            if (transation.error) return transation;
            return {id};
        } catch (error) {
            return {
                error: 'Database query error',
                details: {
                    method: 'RouteItem.insert()' 
                }
            }
        }
    }

}

export default RouteItem;