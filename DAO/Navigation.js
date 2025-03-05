import { god, readonly } from "#clients";
import Presentation from "./Presentation.js";
import { buildRouteURL, buildTopicURL } from "./functions/navigation.js";


class Navigation {

    static async getMenuItems() {

        try {
            const result = await god.query('SELECT * FROM navigation.route');
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
            return {routeURLs: routeURLs, topicURLs: topicURLs};
        } catch (error) {
            console.error('Database query error:', error);
            return { error: 'Database query error' };
        }
    }
}

export default Navigation;