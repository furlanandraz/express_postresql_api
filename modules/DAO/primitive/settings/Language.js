import { god } from "#clients";
import pgError2HttpStatus from '#DAO/functions/formatters/pgError2HttpStatus.js';
import RouteTranslation from '#DAO/primitive/language/RouteTranslation.js';
class Language{

    static async select(options) {

        const {
            code = null,
            is_enabled = null,
            is_default = null,
        } = options;
        
        const conditions = [];
        const params = [];
            
        let query = `
        SELECT
            *
        FROM
            settings.language
        `;

        if (code !== null) {
            params.push(code);
            conditions.push(`code = $${params.length}`);
            
        }

        if (is_enabled !== null) {
            params.push(is_enabled);
            conditions.push(`is_enabled = $${params.length}`);
            
        }

        if (is_default !== null) {
            params.push(is_default);
            conditions.push(`is_default = $${params.length}`);
            
        }

        query += conditions.length ? ` WHERE ${conditions.join(' AND ')};` : ';';

        try {
            const result = await god.query(query, params);
            return result;
        } catch (error) {
            return {
                error: 'Database query error',
                details: {
                    method: 'Language.select()'
                }
            };
        }
    }

    static async setEnabled(code, status = true, inheritedClient) {

        let client = inheritedClient;
        let hasError = false;

        const query = `
        UPDATE
            settings.language
        SET
            is_enabled = $2
        WHERE
            code = $1
        AND
            is_enabled IS DISTINCT FROM $2
        RETURNING
            *;
        `;

        try {
            if (!client) client = await god.connect();
            if (!inheritedClient) await client.query('BEGIN');
            const result = await client.query(query, [code, status]);
            if (!inheritedClient) await client.query('COMMIT');
            return result;
        } catch (error) {
            hasError = true;
            return pgError2HttpStatus(error, 'Language.setEnabled()');
        } finally {
            if (!inheritedClient) {
                if (hasError) await client.query('ROLLBACK');
                client.release();
            }
        }
    }

    static async setDefault(code) {

        let client;
        let hasError = false;

        const setDefault = `
        WITH
            updated
        AS (
            UPDATE
                settings.language
            SET
                is_default = (code = $1)
            WHERE
                is_default IS DISTINCT FROM (code = $1)
            RETURNING *
        )

        SELECT
            *
        FROM
            updated
        WHERE
            is_default = TRUE;
        `;

        try {
            const checkMissing = await RouteTranslation.checkSlugAndLabelMissing(code);
            if (checkMissing.rows.length) return {
                error: true,
                status: 422,
                message: `Following routes are missing translation for ${code} on routes: ${rows.map(route => route.id).join(', ')}`
            }
            client = await god.connect();
            await client.query('BEGIN');
            const enabled = await Language.setEnabled(code, true, client);
            if (enabled.error) return enabled;
            const defaulted = await client.query(setDefault, [code]);
            await client.query('COMMIT');
            return defaulted;
        } catch (error) {
            hasError = true;
            return pgError2HttpStatus(error, 'Language.setDefaulted()');
        } finally {
            if (hasError) await client.query('ROLLBACK');
            client.release();
        }
    }



}

export default Language;