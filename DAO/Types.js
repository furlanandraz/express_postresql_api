import Static from "./Static.js";


class Types extends Static {

    async jsonSchemaInsertMany(jsonSchemaName, arrayOfObjects) {

        const values = arrayOfObjects.reduce((allRows, row) => {
            return allRows + `('${row.url_name}', '${row.ui_name}', '${row.json_ref}'), `;
        }, '').slice(0, -2);

        try {
            const result = await this.client.query(`
                INSERT INTO types.${jsonSchemaName} (url_name, ui_name, json_ref)
                VALUES 
                ${values}
                ON CONFLICT (url_name) DO NOTHING
                RETURNING id;
                `
            );
            return result.rows;
        } catch (error) {
            console.error('Database insert error:', error);
            return { error: 'Database insert error' };
        }
    }
}

export default Types;