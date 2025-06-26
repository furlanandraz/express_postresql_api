import { god } from "#clients";

class View {

    static async routeItem(id = null) {

        let query = `
        SELECT
            *
        FROM
            public.route_item`;
        
        const params = [];
        if (id) {
            params.push(id);
            query += ' WHERE r.id = $1';
        };


        try {
            const result = await god.query(query, params);
            return result.rows;
        } catch (error) {
            console.error('Database query error:', error);
            return { error: 'Database query error' };
        }
    }
}

export default View;