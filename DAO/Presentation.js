import { god, readonly } from '#clients';

import { generateLayoutSchema, generateTemplateSchema } from "./functions/presentation.js";
class Presentation {

    static async getRouteContentById(id) {
        try {
            const {rows: content} = await god.query(`
                SELECT
                    rti.json_data,
                    tt.url_name
                FROM
                    presentation.route_template_instance rti
                LEFT JOIN
                    types.template_type tt
                ON
                    rti.template_type_id = tt.id
                WHERE
                    route_id = $1
                ORDER BY
                    template_instance_order
                ASC;
                `, [id]);
            return content;
        } catch (error) {
            console.error('Database error:', error);
            return { error: 'Databse error' };
        }
    }

    static async getRouteLayoutById(id) {
        try {
            const {rows: [content]} = await god.query(`
                SELECT
                    rli.json_data,
                    lt.url_name
                FROM
                    presentation.route_layout_instance rli
                LEFT JOIN
                    types.layout_type lt
                ON
                    rli.layout_type_id = lt.id
                WHERE
                    route_id = $1
                LIMIT 1;
                `, [id]);
            return content;
        } catch (error) {
            console.error('Database error:', error);
            return { error: 'Databse error' };
        }
    }

    static async getTopicByRouteId(id) {
        try {
            const {rows: content} = await god.query(`
                SELECT
                    ti.id,
                    ti.slug,
                    ti.json_data,
                    ltyp.url_name
                FROM
                    presentation.topic_instance ti
                LEFT JOIN
                    presentation.topic_layout tl
                ON
                    ti.topic_layout_id = tl.id
                LEFT JOIN
                    types.layout_schema lsch
                ON
                    tl.layout_schema_id = lsch.id
                LEFT JOIN
                    types.layout_type ltyp
                ON
                    lsch.layout_type_id = ltyp.id
                WHERE
                    route_id = $1;
                `, [id]);
            return content;
        } catch (error) {
            console.error('Database error:', error);
            return { error: 'Databse error' };
        }
    }

    static async getTopicItems() {
        try {
            const {rows: content} = await god.query(`
                SELECT 
                    ti.id,
                    ti.slug,
                    ti.url_uuid,
                    tl.route_id,
                    ltyp.url_name 
                FROM 
                    presentation.topic_instance ti
                LEFT JOIN 
                    presentation.topic_layout tl ON ti.topic_layout_id = tl.id
                LEFT JOIN 
                    types.layout_schema lsch ON tl.layout_schema_id = lsch.id
                LEFT JOIN 
                    types.layout_type ltyp ON lsch.layout_type_id = ltyp.id;
                `);
            return content;
        } catch (error) {
            console.error('Database error:', error);
            return { error: 'Databse error' };
        }
    }

    static async getTopicById(id) {
        try {
            const {rows: content} = await god.query(`
                SELECT 
                    ti.slug, 
                    ti.json_data, 
                    ltyp.url_name 
                FROM 
                    presentation.topic_instance ti
                LEFT JOIN 
                    presentation.topic_layout tl ON ti.topic_layout_id = tl.id
                LEFT JOIN 
                    types.layout_schema lsch ON tl.layout_schema_id = lsch.id
                LEFT JOIN 
                    types.layout_type ltyp ON lsch.layout_type_id = ltyp.id
                WHERE 
                    ti.id = $1;
                `, [id]);
            return content;
        } catch (error) {
            console.error('Database error:', error);
            return { error: 'Databse error' };
        }
    }

    static async renderTemplateSchemaById(id) {
        try {
            const {rows: [result]}  = await god.query('SELECT * FROM types.template_schema WHERE id = $1 LIMIT 1', [id]);
            const schema = await generateTemplateSchema(result.json_preset);
            // write to db or just send out?
            await god.query('UPDATE types.template_schema SET json_form = $1::jsonb WHERE id = $2', [JSON.stringify(schema), id]);
            return schema;
        } catch (error) {
            console.error('Database error:', error);
            return { error: 'Databse error' };
        }
    }

    static async renderLayoutSchemaById(id) {
        try {
            const { rows: [result] } = await god.query('SELECT json_preset FROM types.layout_schema WHERE id = $1 LIMIT 1', [id]);
            const schema = await generateLayoutSchema(result.json_preset);
            // write to db or just send out?
            await god.query('UPDATE types.layout_schema SET json_form = $1::jsonb WHERE id = $2', [JSON.stringify(schema), id]);
            return schema;
        } catch (error) {
            console.error('Database error:', error);
            return { error: 'Databse error' };
        }
    }

}

export default Presentation;