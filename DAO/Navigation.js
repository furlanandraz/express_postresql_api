import { god, readonly } from "#clients";
import Presentation from "./Presentation.js";
import { buildRouteURL, buildTopicURL } from "./functions/navigation.js";
import { arrayOfObjectsToVALUES } from "./functions/helpers.js";


class Navigation {

    static async getMenuItems() {
        try {
            const result = await god.query(`
                SELECT
                    r.*,
                    u.full_url,
                    u.breadcrumbs
                FROM
                    navigation.route r
                LEFT JOIN
                    navigation.url u
                ON
                    r.url_uuid = u.url_uuid
                WHERE
                    u.primary_url = TRUE;
                `);
            return result.rows;
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
                    navigation.url u
                ON
                    r.url_uuid = u.url_uuid
                WHERE
                    u.primary_url = TRUE;
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
                    navigation.url u
                ON
                    r.url_uuid = u.url_uuid
                WHERE
                    r.id = $1
                AND
                    u.primary_url = TRUE;
                `, [id]);
            return result.rows;
        } catch (error) {
            console.error('Database query error:', error);
            return { error: 'Database query error' };
        }
    }

    static async generateURLs() {
        try {
            const menuItems = await Navigation.getMenuItems();
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
            primary_url: true,
            breadcumbs: row.breadcrumbs
        }));

        topicURLs = topicURLs.map(topic => ({
            url_uuid: topic.url_uuid,
            full_url: topic.full_url,
            primary_url: true,
            breadcumbs: topic.breadcrumbs
        }));
        
        const formattedValues = arrayOfObjectsToVALUES([...routeURLs, ...topicURLs]);

        const qstr = `
            INSERT INTO navigation.url (url_uuid, full_url, primary_url, breadcrumbs) 
            VALUES ${formattedValues};
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