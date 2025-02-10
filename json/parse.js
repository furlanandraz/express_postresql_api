
import Types from '#DAO/Types.js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const schemaDirectories = [
    {
        tableName: 'types.component_type',
        dirName: 'component_schemas'
    },
    {
        tableName: 'types.template_type',
        dirName: 'template_schemas'
    }
];

// parser to be redone for .svelte files not .svelte.json in the future, json schemas editing moved to cms, real components parsed - or json schemas possibly moved to same folder and parsed together with components

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

// this parser to be used also with components and templates, now only for layouts that dont need json schema

const libDirectory = [
    {
        table: 'layout_type',
        dir: 'sveltekit_cms_test/src/lib/layouts'
    },
];

(function lib2table(libDirectory) {

    libDirectory.forEach(async directory => {
        let data = [];
        let { table, dir } = directory;
        dir = path.resolve(__dirname, '../..', dir);
        console.log(dir);
        let files = fs.readdirSync(dir);
        files = files.filter(file => file.endsWith('.svelte') && file);
        files.forEach(file => {
            data.push({
                url_name: file,
                ui_name: file.replace(/\.svelte$/, '').replace(/([a-z])([A-Z])/g, '$1 $2'),
            });
        });

        try {
            await Types.setClient('god').layoutTypesInsertMany(data);
            console.log('inserted');
        } catch (error) {
            console.log(error);
        }

    });

})(libDirectory);