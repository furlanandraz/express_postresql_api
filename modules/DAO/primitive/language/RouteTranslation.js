import { god } from "#clients";


import rows2insert from "#DAO/functions/transformers/rows2insert.js";

class RouteTranslation {

    // static async select(id = null) {

    //     let query = `
    //     SELECT
    //         *
    //     FROM
    //         navigation.route`;
        
    //     const params = [];
    //     if (id) {
    //         params.push(id);
    //         query += ' WHERE id = $1';
    //     };


    //     try {
    //         const result = await god.query(query, params);
    //         return {rows: result.rows};
    //     } catch (error) {
    //         console.error('Internal database error:', error);
    //         return { error: 'Internal database error.' };
    //     }
    // }

    static async insert(id = 1, data) {

        data = data.map(translation => ({ route_id: id, ...translation }));


        
        const {columns, values} = rows2insert(data, 'language.route_translation')
        
        let query = `
        INSERT INTO
            language.route_translation ${columns}
        VALUES
            ${values}`;

        try {
            const result = await god.query(query);
            return {rows: result.rows};
        } catch (error) {
            console.error('Internal database error:', error);
            return {
                error: 'Database query error',
                details: {
                    method: 'RouteTranslation.insert()' 
                }
            }
        }
    }

    
}

export default RouteTranslation;