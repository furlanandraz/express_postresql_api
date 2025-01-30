import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

import { god } from '#clients';


async function renderSegmentSchemaById(id) {
    const {rows: [row]}  = await god.query('SELECT * FROM types.segment_schema WHERE id = $1 LIMIT 1', [id]);
    const json_preset = row.json_preset;
    await regenerateSchema(json_preset);

}

async function regenerateSchema(schema) {
    
    const properties = schema.properties;
    let ids = {template_id: null, component_id: []};
    for (const [key, value] of Object.entries(properties)) {
        console.log(key, value)
        if (key === 'template') {
            ids['template_id'] = value.template_id
        } else {
            ids['component_id'].push(value.component_id)
        }

    }
    ids['component_id'] = [...new Set(ids['component_id'])];
    console.log(ids);

    // execute querries to get json_refs for ids in array by table, read files in ref paths and replace them in parent schema
}

renderSegmentSchemaById(2);