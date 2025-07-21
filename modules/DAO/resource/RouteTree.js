import RouteItem from '#DAO/primitive/navigation/Route.js';
import pgError2HttpStatus from "#DAO/functions/formatters/pgError2HttpStatus.js";

class RouteTree {

    static async select() {

        try {
            const result = await RouteItem.select();
            return result;
        } catch (error) {
            return pgError2HttpStatus(error, 'RouteTree.select()');
        }
    }

    

}

export default RouteTree;