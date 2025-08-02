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

    static async updateURL(data, inheritedClient) {

        const client = inheritedClient || await god.connect();
        let hasError = false;

        const values = [];
        const params = [];
        
        data.forEach((row, i) => {
            values.push(`($${i * 4 + 1}, $${i * 4 + 2}, $${i * 4 + 3}, $${i * 4 + 4})`);
            params.push(
                row.route_id,
                row.language_code,
                row.path,
                JSON.stringify(row.breadcrumbs)
            );
        });

        const query = `
            UPDATE
                language.route_translation
            AS
                rt
            SET
                path = v.path::text,
                breadcrumbs = v.breadcrumbs::json
            FROM (
                VALUES
                    ${values.join(',\n')}
            ) AS
                v(route_id, language_code, path, breadcrumbs)
            WHERE
                rt.route_id::int = v.route_id::int
            AND
                rt.language_code::varchar(2) = v.language_code::varchar(2)
            RETURNING
                rt.*;
        `;

        try {
            if (!inheritedClient) await client.query('BEGIN');
            const update = await client.query(query, params);
            if (update.error) return update;
            if (!inheritedClient) await client.query('COMMIT');
            return update;
        } catch (error) {
            hasError = true;
            return pgError2HttpStatus(error, 'RouteTranslation.updateURL()');
        } finally {
            if (!inheritedClient) {
                if(hasError) await client.query('ROLLBACK');
                client.release();
            }
        }
    }
    

    static async checkSlugAndLabelMissing(language_code) {
        const query = `            
            SELECT
                id,
                label
            FROM
                language.route_translation
            WHERE
                language_code = $1
            AND
               (label = '' OR slug = '');
        `;

        try {
            const result = await client.query(query, [language_code]);
            return {rows: result.rows};
        } catch (error) {
            return pgError2HttpStatus(error, 'RouteTranslation.checkSlugAndLabelMissing()');
        }
    
    }
    
}

export default RouteTranslation;