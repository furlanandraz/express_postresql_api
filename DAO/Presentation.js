import Static from "./Static.js";


class Presentation extends Static {

    async getPageContentById(id) {

        try {
            const {rows: content} = await this.client.query(`
                SELECT * FROM
                    presentation.route_page_segment_type
                WHERE
                    route_id = $1
                ORDER BY
                    segment_instance_order
                ASC;
                `, [id]);
          
            const contentOrder = content.reduce((acc, segment) => {
                acc[segment.segment_instance_order] = {segment_json: segment.segment_json, url_name: segment.url_name};
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
                    presentation.route_layout_type_url
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
}

export default Presentation;