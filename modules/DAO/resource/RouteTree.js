import RouteItem from '#DAO/primitive/navigation/Route.js';
import pgError2HttpStatus from "#DAO/functions/formatters/pgError2HttpStatus.js";
import resourceRouteItemTree from '#DAO/functions/builders/resourceRouteItemTree.js';

class RouteTree {

    static async select(simple = false) {

        try {
            return await resourceRouteItemTree(simple);
        } catch (error) {
            console.error(error);
            return pgError2HttpStatus(error, 'RouteTree.select()');
        }
    }
}

export default RouteTree;