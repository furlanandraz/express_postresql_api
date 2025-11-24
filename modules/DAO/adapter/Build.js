import RouteTree from '#DAO/resource/RouteTree.js';
import navigationRouteTree from "#DAO/functions/builders/navigationRouteTree.js";

class Build {

    static async navigation() {

        try {
            const rotues = await RouteTree.select();
            if (rotues.error) return rotues;
            return rotues;
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