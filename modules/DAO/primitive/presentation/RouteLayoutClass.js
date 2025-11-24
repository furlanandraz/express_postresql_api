import { god } from "#clients";

class RouteLayoutClass {

    static async update(routeId, payload) {

        const query = `
        INSERT INTO
            presentation.route_layout_class (
                route_id,
                layout_type_id
            )
        VALUES (
            $1::int,
            $2::int
        )
        ON CONFLICT (route_id)
        DO UPDATE SET
            layout_type_id = EXCLUDED.layout_type_id
        RETURNING *;
        `;

        
        try {
            const result = await god.query(query, [routeId, payload.layout_type_id]);
            return result;
        } catch (error) {
            return {
                error: 'Database query error',
                details: {
                    method: 'RouteLayoutClass.update()'
                }
            }
        }
    }

    static async delete(routeId) {

        const query = `
        DELETE FROM
            presentation.route_layout_class
        WHERE
            route_id = $1::int
        RETURNING
            *;
        `;

        try {
            const result = await god.query(query, [routeId]);
            return result;
        } catch (error) {
            return {
                error: 'Database query error',
                details: {
                    method: 'RouteLayoutClass.update()'
                }
            }
        }
    }

    
}

export default RouteLayoutClass;