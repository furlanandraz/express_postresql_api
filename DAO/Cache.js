import Static from "./Static.js";


class Cache extends Static {

    async cacheMenuTree(menuTree) {

        try {
            await this.client.query(`
                INSERT INTO cache.navigation_cache (cache_name, cache_json)
                VALUES ($1, $2)
                ON CONFLICT (cache_name)
                DO UPDATE SET cache_json = EXCLUDED.cache_json;
                `,
                ['menu_tree', JSON.stringify(menuTree)]);
        } catch (error) {
            console.error('Cache error:', error);
            return { error: 'Cache error' };
        }
    }
}

export default Cache;