import Static from "./Static.js";
import Presentation from "./Presentation.js";
import { buildRouteLink, buildTopicLink } from "./functions/navigation.js";


class Navigation extends Static {

    async getMenuItems() {

        try {
            const result = await this.client.query('SELECT * FROM navigation.route');
            return result.rows;
        } catch (error) {
            console.error('Database query error:', error);
            return { error: 'Database query error' };
        }
    }

    async generateRouteLinks() {
        
        try {
            
            const menuItems = await Navigation.setClient('god').getMenuItems();
            const topicItems = await Presentation.setClient('god').getTopicItems();
            console.log(topicItems)
            const routeLinks = buildRouteLink(menuItems);
            const topicLinks = buildTopicLink(routeLinks, topicItems);
            return {routeLinks: routeLinks, topicLinks: topicLinks};
        } catch (error) {
            console.error('Database query error:', error);
            return { error: 'Database query error' };
        }
        
    }
}

export default Navigation;