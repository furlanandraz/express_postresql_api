import { god, readonly } from '#clients';


class Types extends Static {

    static async jsonSchemaInsertMany(jsonSchemaName, arrayOfObjects) {

        const values = arrayOfObjects.reduce((allRows, row) => {
            return allRows + `('${row.url_name}', '${row.ui_name}', '${row.json_ref}'), `;
        }, '').slice(0, -2);

        const allExistingFiles = arrayOfObjects.map(row => `'${row.url_name}'`).join(', ');

        try {
            const result = await god.query(`
                INSERT INTO ${jsonSchemaName} (url_name, ui_name, json_ref)
                VALUES 
                ${values}
                ON CONFLICT (url_name) DO NOTHING;
                DELETE FROM ${jsonSchemaName}
                WHERE url_name NOT IN (${allExistingFiles});
                `
            );
            return result.rows;
        } catch (error) {
            console.error('Database insert error:', error);
            return { error: 'Database insert error' };
        }
    }

    static async layoutTypesInsertMany(data) {

        const values = data.reduce((all, row) => {
            return all + `('${row.url_name}', '${row.ui_name}'), `;
        }, '').slice(0, -2);

        const existing = `(${data.map(value => `'${value.url_name}'`).join(', ')})`;

        console.log(values, "\n", existing);


        try {
            await god.query(`
                INSERT INTO types.layout_type (url_name, ui_name)
                VALUES ${values}
                ON CONFLICT (url_name) DO NOTHING;
                DELETE FROM types.layout_type
                WHERE url_name NOT IN ${existing};`
            );
        } catch (error) {
            console.error('Database insert error:', error);
            return { error: 'Database insert error' };
        }
    }
    
}

export default Types;