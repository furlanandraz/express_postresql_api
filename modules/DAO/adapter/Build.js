import Route from '#DAO/primitive/navigation/Route.js';
import navigationRouteTree from "#DAO/functions/builders/navigationRouteTree.js";

class Build {

    static async navigation() {

        try {
            const rotues = await Route.select();
            if (rotues.error) return rotues;
            return navigationRouteTree(rotues.rows);
        } catch (error) {
            console.error(error)
            return {
                error: 'Database query error',
                details: {
                    method: 'Build.navigation()' 
                }
            }
        }
    }

   
}

export default Build;