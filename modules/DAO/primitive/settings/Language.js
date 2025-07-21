import { god } from "#clients";

class Language{

    static async select(options) {

        const {
            code = null,
            is_enabled = null,
            is_default = null
        } = options;
        
        const conditions = [];
        const params = [];
            
        let query = `
        SELECT
            *
        FROM
            settings.language
        `;

        if (code !== null ) {
            conditions.push(`code = $${params.length + 1}`);
            params.push(code);
        }

        if (is_enabled !== null) {
            conditions.push(`is_enabled = $${params.length + 1}`);
            params.push(is_enabled);
        }

        if (is_default !== null) {
            conditions.push(`is_default = $${params.length + 1}`);
            params.push(is_default);
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

}

export default Language;