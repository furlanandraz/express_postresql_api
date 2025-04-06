import { god } from '#clients';
import Navigation from '#DAO/Navigation.js';
import { buildRouteTree } from './functions/builders/navigation.js';

class Cache {

    static async updateRouteTree() {

        try {

            const routeItems = await Navigation.getRouteItems();
            const routeTree = buildRouteTree(routeItems);
            await god.query(`
                INSERT INTO cache.navigation_cache (cache_name, cache_json)
                VALUES ($1, $2)
                ON CONFLICT (cache_name)
                DO UPDATE SET cache_json = EXCLUDED.cache_json;
                `,
                ['route_tree', JSON.stringify(routeTree)]);
        } catch (error) {
            console.error('Cache error:', error);
            return { error: 'Cache error' };
        }
    }
}

export default Cache;