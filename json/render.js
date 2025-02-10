import fs from 'fs';

import { god } from '#clients';


async function renderSegmentSchemaById(id) {
    const {rows: [result]}  = await god.query('SELECT * FROM types.segment_schema WHERE id = $1 LIMIT 1', [id]);
    const json_preset = result.json_preset;
    const regeneratedSchema = await regenerateSchema(json_preset);
    await god.query('UPDATE types.segment_schema SET json_form = $1 WHERE id = $2', [JSON.stringify(regeneratedSchema), id])
}

async function regenerateSchema(schema) {
    
    const mainProperties = schema.properties;
    let ids = { template: mainProperties.template.template_id, components: [] };
    
    for (const [key, value] of Object.entries(mainProperties.components.properties)) {
        ids['components'].push(value.component_id)
    }

    ids['components'] = [...new Set(ids['components'])];


    let { rows: [resultTemplate] } = await god.query('SELECT json_ref FROM types.template_type WHERE id=$1 LIMIT 1;', [ids.template]);
    let json_ref_template = resultTemplate.json_ref;
    mainProperties.template = JSON.parse(fs.readFileSync(json_ref_template, 'utf-8'));


    
    const {rows: resultComponents} = await god.query('SELECT DISTINCT id, json_ref FROM types.component_type WHERE id=ANY($1::int[]);', [ids.components]);
    
    

    for (const [key, value] of Object.entries(mainProperties.components.properties)) {
        const property = mainProperties.components.properties[key];
        const propertyId = property.component_id;
        console.log
        const [componentPath] = resultComponents.filter(component => component.id === propertyId);
        // console.log(componentPath);
        mainProperties.components.properties[key] = JSON.parse(fs.readFileSync(componentPath.json_ref, 'utf-8'));
    }

    return {...schema, properties: mainProperties};
}

renderSegmentSchemaById(1);