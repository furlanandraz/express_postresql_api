import clients from '#clients';

export default class dao {
    async getMenuItems(client = readonly) {
        try {
            const result = await clientPool.query('SELECT * FROM navigation.menu_item');
            res.json(result.rows)
        } catch (error) {
            console.error('Error fetching navigation items:', error);
            res.status(500).json({ error: 'Failed to fetch navigation items' });
        }
    }
}