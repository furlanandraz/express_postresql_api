import { god } from "#clients";


import rows2insert from "#DAO/functions/transformers/rows2insert.js";

class RouteTranslation {

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
            return {rows: result.rows};
        } catch (error) {
            console.error('Internal database error:', error);
            return { error: 'Internal database error.' };
        }
    }

    static async insert(id, data) {

        data = data.map(translation => ({ route_id: id, ...translation }));

        // let query = `
        // INSERT INTO language.route_translation (
        //     language_code,
        //     slug,
        //     title,
        //     label,
        //     meta_description,
        //     meta_keywords
        // ) VALUES (
        //     $1::varchar(2),
        //     $2::text,
        //     $3::text,
        //     $4::text,
        //     $5::text,
        //     $6::text
        // )`;
        
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

    static async update(id, data) {

        data = data.map(translation => ({ route_id: id, ...translation }));

        const query = `
            UPDATE
                language.route_translation
            SET
                slug = $3::text,
                title = $4::text,
                label = $5::text,
                meta_description = $6::text,
                meta_keywords = $7::text
            WHERE
                route_id = $1::int
            AND
                language_code = $2::varchar(2)
            RETURNING *;
        `;
    

        try {
            await god.query('BEGIN;');
    
            const rows = [];
    
            for (const translation of data) {
                
                const result = await god.query(query, [
                    translation.route_id,
                    translation.language_code,
                    translation.slug,
                    translation.title,
                    translation.label,
                    translation.meta_description,
                    translation.meta_keywords
                ]);
                rows.push(result.rows[0]);
            }
    
            await god.query('COMMIT;');
    
            return rows;
    
        } catch (error) {
            await god.query('ROLLBACK;');
            console.error('Internal database error:', error);
            return {
                error: 'Database query error',
                details: {
                    method: 'RouteTranslation.update()'
                }
            };
        }
    }
    

    
}

export default RouteTranslation;