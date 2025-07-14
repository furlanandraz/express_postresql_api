import { god } from "#clients";
import pgError2HttpStatus from "#DAO/functions/formatters/pgError2HttpStatus.js";
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

    static async insert(id, data, inheritedClient) {

        const client = inheritedClient || await god.connect();
        let hasError = false;

        data = data.map(translation => ({ route_id: id, ...translation }));
        
        const {columns, values} = rows2insert(data, 'language.route_translation')
        
        let query = `
        INSERT INTO
            language.route_translation ${columns}
        VALUES
            ${values}`;

        try {
            if (!inheritedClient) await client.query('BEGIN');
            const result = await client.query(query);
            if (!inheritedClient) await client.query('COMMIT');
            return {rows: result.rows};
        } catch (error) {
            hasError = true;
            return pgError2HttpStatus(error, 'RouteTranslation.insert()');
        } finally {
            if (!inheritedClient) {
                if (hasError) await client.query('ROLLBACK');
                client.release();
            }
        }
    }

    static async update(id, data, inheritedClient) {

        const client = inheritedClient || await god.connect();
        let hasError = false;

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
            if (!inheritedClient) await client.query('BEGIN;');
    
            const rows = [];
    
            for (const translation of data) {
                
                const result = await client.query(query, [
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
    
            if (!inheritedClient) await client.query('COMMIT;');
    
            return rows;
    
        } catch (error) {
            hasError = true;
            return pgError2HttpStatus(error, 'RouteTranslation.update()');
        } finally {
            if (!inheritedClient) {
                if(hasError) await client.query('ROLLBACK');
                client.release();
            }
        }
    }
    

    
}

export default RouteTranslation;