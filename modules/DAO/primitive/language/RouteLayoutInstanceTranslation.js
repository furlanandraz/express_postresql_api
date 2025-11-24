import { god } from "#clients";
import pgError2HttpStatus from "#DAO/functions/formatters/pgError2HttpStatus.js";

class RouteLayoutInstanceTranslation {

    static async update(routeId, payload) {

        const params = payload.flatMap(t => [t.language_code, t.properties]);
        const values = payload.map((_, i) => `($1, $${i * 2 + 2}, $${i * 2 + 3}::json)`);
        
        let query = `
        INSERT INTO
            language.route_layout_instance_translation (
                route_id,
                language_code,
                data
            )
        VALUES
            ${values.join(",\n")}
        ON CONFLICT (route_id, language_code)
            DO UPDATE SET data = EXCLUDED.data
        RETURNING *`;
        
        console.log(query);


        try {
            const result = await god.query(query, [routeId, ...params]);
            return {rows: result.rows};
        } catch (error) {
            return pgError2HttpStatus(error, 'RouteLayoutInstanceTranslation.update()');
        }
    }
    
}

export default RouteLayoutInstanceTranslation;