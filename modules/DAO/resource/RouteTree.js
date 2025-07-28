import RouteItem from '#DAO/primitive/navigation/Route.js';
import pgError2HttpStatus from "#DAO/functions/formatters/pgError2HttpStatus.js";
import resourceRouteItemTree from '#DAO/functions/builders/resourceRouteItemTree.js';

class RouteTree {

    static async select() {

        try {
            return await resourceRouteItemTree();
        } catch (error) {
            console.log(error);
            return pgError2HttpStatus(error, 'RouteTree.select()');
        }
    }
}

export default RouteTree;