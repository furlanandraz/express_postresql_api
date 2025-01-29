
import Types from '#DAO/Types.js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
console.log(__dirname);

const schemaDirectories = [
    {
        tableName: 'component_schema',
        dirName: 'component_schemas'
    },
    {
        tableName: 'template_schema',
        dirName: 'template_schemas'
    }
];

schemaDirectories.forEach(async directory => {

    const basePath = path.join(__dirname, directory.dirName);
    const allFiles = fs.readdirSync(basePath);
    const allSchemas = allFiles.filter(file => file.endsWith('.svelte.json') && file);
    const allValues = allSchemas.reduce((allRows, row) => {
        allRows.push({
            url_name: row,
            ui_name: row.replace(/\.svelte\.json$/, '').replace(/([a-z])([A-Z])/g, '$1 $2'),
            json_ref: path.resolve(__dirname, directory.dirName, row)
        });
        return allRows;
    }, []);

    
    try {
        await Types.setClient('god').jsonSchemaInsertMany(directory.tableName, allValues);
        console.log('inserted');
    } catch (error) {
        console.log(error);
    }

});