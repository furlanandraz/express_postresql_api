import { god } from "#DAO/clients/index.js";
import LayoutType from "#DAO/primitive/prototype/LayoutType.js";

class RouteLayout {
    
    static async selectPreset(routeId) {
        
        const query = `
        SELECT
            *
        FROM
            public.route_layout_preset rlp
        WHERE
            rlp.route_id = $1;
        `;

        try {
            const result = await god.query(query, [routeId]);
            return result;
        } catch (error) {
            console.error(error);
            return {
                error: 'Database query error',
                details: {
                    method: 'RouteLayout.selectPreset()' 
                }
            };
        }
    }

    static async selectProperties(routeId) {
        
        const query = `
        SELECT
            *
        FROM
            public.route_layout_properties rlp
        WHERE
            rlp.route_id = $1;
        `;

        try {
            const result = await god.query(query, [routeId]);
            return result;
        } catch (error) {
            console.error(error);
            return {
                error: 'Database query error',
                details: {
                    method: 'RouteLayout.selectProperties()' 
                }
            };
        }
    }
}

export default RouteLayout;