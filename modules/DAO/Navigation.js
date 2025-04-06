import { god } from "#clients";
import Presentation from "./Presentation.js";
import { buildRouteURL, buildTopicURL } from "./functions/builders/navigation.js";
import { arrayOfObjectsToVALUES } from "./functions/transformers/generic.js";


class Navigation {

    static async getRouteItems() {
        try {
            const result = await god.query(`
                SELECT
                    r.*,
                    u.full_url,
                    u.breadcrumbs
                FROM
                    navigation.route r
                LEFT JOIN
                    navigation.url_primary u
                ON
                    r.url_uuid = u.url_uuid
                `);
            return result.rows;
        } catch (error) {
            console.error('Database query error:', error);
            return { error: 'Database query error' };
        }
    }

    static async getRouteTree() {
        try {
            const result = await god.query(`
                SELECT
                    cache_json
                FROM
                    cache.navigation_cache   
                WHERE
                    cache_name = 'route_tree';
                `);
            if(result.rows) return result.rows[0].cache_json;
            return { error: 'No cache found' };
        } catch (error) {
            console.error('Database query error:', error);
            return { error: 'Database query error' };
        }
    }


    static async getMenuItemsSimple() {
        try {
            const result = await god.query(`
                SELECT
                    r.id,
                    r.parent_id,
                    r.title,
                    u.full_url
                FROM
                    navigation.route r
                LEFT JOIN
                    navigation.url_primary u
                ON
                    r.url_uuid = u.url_uui;
                `);
            return result.rows;
        } catch (error) {
            console.error('Database query error:', error);
            return { error: 'Database query error' };
        }
    }

    static async getMenuItemFrontById(id) {
        try {
            const result = await god.query(`
                SELECT
                    r.title,
                    r.meta_description,
                    r.meta_keywords,
                    u.breadcrumbs
                FROM
                    navigation.route r
                LEFT JOIN
                    navigation.url_primary u
                ON
                    r.url_uuid = u.url_uuid
                WHERE
                    r.id = $1;
                `, [id]);
            return result.rows;
        } catch (error) {
            console.error('Database query error:', error);
            return { error: 'Database query error' };
        }
    }

    static async generateURLs() {
        try {
            const menuItems = await Navigation.getRouteItems();
            const topicItems = await Presentation.getTopicItems();
            const routeURLs = buildRouteURL(menuItems);
            const topicURLs = buildTopicURL(routeURLs, topicItems);
            const formatted = await Navigation.insertBatchURL(routeURLs, topicURLs);
            return formatted;
        } catch (error) {
            console.error('Database query error:', error);
            return { error: 'Database query error' };
        }
    }

    static async insertBatchURL(routeURLs, topicURLs) {

        routeURLs = routeURLs.map(row => ({
            url_uuid: row.url_uuid,
            full_url: row.full_url,
            breadcumbs: row.breadcrumbs
        }));

        topicURLs = topicURLs.map(topic => ({
            url_uuid: topic.url_uuid,
            full_url: topic.full_url,
            breadcumbs: topic.breadcrumbs
        }));
        
        const formattedValues = arrayOfObjectsToVALUES([...routeURLs, ...topicURLs]);

        
        const qstr = `
            INSERT INTO navigation.url_primary (url_uuid, full_url, breadcrumbs) 
            VALUES ${formattedValues}
            ON CONFLICT (url_uuid)
            DO UPDATE SET 
                full_url = EXCLUDED.full_url,
                breadcrumbs = EXCLUDED.breadcrumbs;
            ;
        `;

        try {
            await god.query(qstr);
            return { success: true };
        } catch (error) {
            console.error('Database query error:', error);
            return { error: 'Database query error' };
        }
    }
}

export default Navigation;