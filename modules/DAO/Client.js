import { readonly } from '#DAO/clients/index.js';

class Client {

    static async layoutBuild(id) {

        const res = {};
        
        try {

            let rows;

            ({ rows } = await readonly.query(`
                SELECT
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
                `, [id]));
            
            if (rows[0]?.url_name) res.layout = { url_name: rows[0].url_name };

            ({ rows } = await readonly.query(`
                SELECT
                    COUNT(*) as count
                FROM 
                    presentation.topic_instance ti
                LEFT JOIN 
                    presentation.topic_layout tl ON ti.topic_layout_id = tl.id
                LEFT JOIN 
                    navigation.route r ON tl.route_id = r.id
                LEFT JOIN 
                    navigation.url_primary u ON ti.url_uuid = u.url_uuid
                WHERE 
                    tl.route_id = $1
                `, [id]));
            
            

            if (rows[0]?.count > 0) res.grid = true;

            
            return res;

        } catch (error) {
            console.error('Database error:', error);
            return { error: 'Database error' };
        }
    }

    static async layoutData(id) {
        
        const res = {};

        try {

            let rows;

            ({ rows } = await readonly.query(`
                SELECT
                    u.breadcrumbs
                FROM
                    navigation.route r
                LEFT JOIN
                    navigation.url_primary u
                ON
                    r.url_uuid = u.url_uuid
                WHERE
                    r.id = $1;
                `, [id]));
            
            if (rows[0]?.breadcrumbs) res.breadcrumbs = rows[0].breadcrumbs;

            ({rows} = await readonly.query(`
                SELECT
                    rli.json_data
                FROM
                    presentation.route_layout_instance rli
                WHERE
                    route_id = $1
                LIMIT 1;
                `, [id]));
            
            if (rows[0]?.json_data) res.props = rows[0].json_data;

            ({rows} = await readonly.query(`
                SELECT
                    ti.title,
                    u.full_url
                FROM
                    presentation.topic_instance ti
                LEFT JOIN
                    presentation.topic_layout tl
                ON
                    ti.topic_layout_id = tl.id
                LEFT JOIN
                    navigation.route r
                ON
                    tl.route_id = r.id
                LEFT JOIN
                    navigation.url_primary u
                ON
                    ti.url_uuid = u.url_uuid
                WHERE
                    tl.route_id = $1;
                `, [id]));
            
            if (rows[0]) res.grid = rows;

            if (id == 1) {
                ({ rows } = await readonly.query(`
                SELECT
                    cache_json
                FROM
                    cache.navigation_cache
                WHERE
                    cache_name
                LIKE
                    'menu_tree';
                `));

                if (rows[0]?.cache_json) res.menu = rows[0].cache_json[0];
            }

            return res;
        } catch (error) {
            console.error('Database error:', error);
            return { error: 'Database error' };
        }
    }

    static async pageBuild(id) {

        const res = {};

        try {

            let rows;

            ({ rows } = await readonly.query(`
                SELECT
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
                `, [id]));
            
            if (rows[0]?.url_name) res.template = rows;

            return res;
        } catch (error) {
            console.error('Database error:', error);
            return { error: 'Database error' };
        }
    }

    static async pageData(id) {
        
        const res = {};

        try {

            let rows;

            ({rows} = await readonly.query(`
                SELECT
                    rti.json_data
                FROM
                    presentation.route_template_instance rti
                WHERE
                    route_id = $1
                ORDER BY
                    template_instance_order
                ASC;
                `, [id]));
            
            if (rows[0]?.json_data) res.props = rows;
            
            return res;

        } catch (error) {
            console.error('Database error:', error);
            return { error: 'Databse error' };
        }
    }

    static async topicBuild(id) {

        const res = {};

        try {

            let rows;

            ({ rows } = await readonly.query(`
                SELECT
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
                    route_id = $1
                LIMIT 1;
                `, [id]));
            
            if (rows[0]?.url_name) res.layout = {url_name: rows[0].url_name};

            return res;
        } catch (error) {
            console.error('Database error:', error);
            return { error: 'Database error' };
        }
    }

    static async topicData(url) {

        const res = {};

        try {

            let rows;

            ({ rows } = await readonly.query(`
                SELECT
                    breadcrumbs
                FROM
                    navigation.url
                WHERE
                    full_url LIKE $1;
                `, [url]));
            
            if (rows[0]?.breadcrumbs) res.breadcrumbs = rows[0].breadcrumbs;
            
            ({rows} = await readonly.query(`
                SELECT
                    ti.json_data
                FROM
                    presentation.topic_instance ti
                LEFT JOIN
                    navigation.url_primary u
                ON
                    ti.url_uuid = u.url_uuid
                WHERE
                    u.full_url LIKE $1;
                `, [url]));
            
            if (rows[0]?.json_data) res.props = rows[0].json_data;
            
            return res;
        } catch (error) {
            console.error('Database error:', error);
            return { error: 'Databse error' };
        }
    }


}

export default Client;