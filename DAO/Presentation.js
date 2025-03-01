import Static from "./Static.js";

import { generateLayoutSchema, generateTemplateSchema } from "./functions/presentation.js";
class Presentation extends Static {

    async getPageContentById(id) {

        try {
            const {rows: content} = await this.client.query(`
                SELECT * FROM
                    presentation.route_page_template
                WHERE
                    route_id = $1
                ORDER BY
                    template_instance_order
                ASC;
                `, [id]);
          
            const contentOrder = content.reduce((acc, segment) => {
                acc[segment.template_instance_order] = {segment_json: segment.segment_json, url_name: segment.url_name};
                return acc;
            }, {});
            return contentOrder;
        } catch (error) {
            console.error('Database error:', error);
            return { error: 'Databse error' };
        }
    }

    async getPageLayoutById(id) {

        try {
            const {rows: [content]} = await this.client.query(`
                SELECT * FROM
                    presentation.route_layout_instance
                WHERE
                    route_id = $1
                LIMIT 1;
                `, [id]);
            console.log(content);
            return content;
        } catch (error) {
            console.error('Database error:', error);
            return { error: 'Databse error' };
        }
    }

    async renderTemplateSchemaById(id) {
        try {
            const {rows: [result]}  = await this.client.query('SELECT * FROM types.template_schema WHERE id = $1 LIMIT 1', [id]);
            const schema = await generateTemplateSchema(result.json_preset);
            // write to db or just send out?
            await this.client.query('UPDATE types.template_schema SET json_form = $1::jsonb WHERE id = $2', [JSON.stringify(schema), id]);
            return schema;
        } catch (error) {
            console.error('Database error:', error);
            return { error: 'Databse error' };
        }
    }

    async renderLayoutSchemaById(id) {
        try {
            const { rows: [result] } = await this.client.query('SELECT json_preset FROM types.layout_schema WHERE id = $1 LIMIT 1', [id]);
            const schema = await generateLayoutSchema(result.json_preset);
            // write to db or just send out?
            await this.client.query('UPDATE types.layout_schema SET json_form = $1::jsonb WHERE id = $2', [JSON.stringify(schema), id]);
            return schema;
        } catch (error) {
            console.error('Database error:', error);
            return { error: 'Databse error' };
        }
    }

}

export default Presentation;