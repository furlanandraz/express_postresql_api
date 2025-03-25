import { god } from "#clients";
import fs from 'fs';

export async function generateTemplateSchema(schema) {
    
    const mainProperties = schema.properties;
    let ids = { template: mainProperties.template.template_id, components: [] };
    
    for (const [_, value] of Object.entries(mainProperties.components.properties)) {
        ids['components'].push(value.component_id)
    }

    ids['components'] = [...new Set(ids['components'])];

    let { rows: [resultTemplate] } = await god.query('SELECT json_ref FROM types.template_type WHERE id=$1 LIMIT 1;', [ids.template]);
    let json_ref_template = resultTemplate.json_ref;
    mainProperties.template = JSON.parse(fs.readFileSync(json_ref_template, 'utf-8'));

    const {rows: resultComponents} = await god.query('SELECT DISTINCT id, json_ref FROM types.component_type WHERE id=ANY($1::int[]);', [ids.components]);
    
    for (const [key, _] of Object.entries(mainProperties.components.properties)) {
        const property = mainProperties.components.properties[key];
        const propertyId = property.component_id;
        
        const [componentPath] = resultComponents.filter(component => component.id === propertyId);
        mainProperties.components.properties[key] = JSON.parse(fs.readFileSync(componentPath.json_ref, 'utf-8'));
    }

    return {...schema, properties: mainProperties};
}

export async function generateLayoutSchema(schema) {
    
    const mainProperties = schema.properties;

    let ids = { layout: mainProperties.layout.layout_id };
    
    if (mainProperties.templates.properties) {
        ids = {
            ...ids,
            templates: []
        };
    
    if (mainProperties.templates.properties) {
        for (const [_, value] of Object.entries(mainProperties.templates.properties)) {
            ids['templates'].push(value.template_id);
        }
        }
        for (const [_, value] of Object.entries(mainProperties.templates.properties)) {
            ids['templates'].push(value.template_id);
        }

        ids['templates'] = [...new Set(ids['templates'])];

        const { rows: resultTemplates } = await god.query(
        'SELECT DISTINCT template_type_id, json_form FROM types.template_schema WHERE template_type_id = ANY($1::int[])',
        [Array.isArray(ids.templates) ? ids.templates : [ids.templates]]);
    
        if (resultTemplates) {
            for (const [key, _] of Object.entries(mainProperties.templates.properties)) {
                const property = mainProperties.templates.properties[key];
                const propertyId = property.template_id;
                
                const [templatePath] = resultTemplates.filter(template => template.template_type_id === propertyId);
                
                mainProperties.templates.properties[key] = templatePath.json_form;
            }
        }
    }

    if (mainProperties.components.properties) {
        ids = {
            ...ids,
            components: []
        };
        for (const [_, value] of Object.entries(mainProperties.components.properties)) {
            ids['components'].push(value.component_id)
        }

        ids['components'] = [...new Set(ids['components'])];
        
         const { rows: resultComponents } = await god.query('SELECT DISTINCT id, json_ref FROM types.component_type WHERE id=ANY($1::int[]);',
        [Array.isArray(ids.components) ? ids.components : [ids.components]]);   

        if (resultComponents) {
            for (const [key, _] of Object.entries(mainProperties.components.properties)) {
                const property = mainProperties.components.properties[key];
                const propertyId = property.component_id;
                
                const [componentPath] = resultComponents.filter(component => component.id === propertyId);
                
                mainProperties.components.properties[key] = JSON.parse(fs.readFileSync(componentPath.json_ref, 'utf-8'));
            }
        }
    }

    let { rows: [result] } = await god.query('SELECT json_ref FROM types.layout_type WHERE id=$1 LIMIT 1;', [ids.layout]);
    mainProperties.layout = fs.readFileSync(result.json_ref, 'utf-8');

    if (mainProperties.layout !== '') JSON.parse(mainProperties.layout);
    else mainProperties.layout = '{}';
    
    return { ...schema, properties: mainProperties };
}

