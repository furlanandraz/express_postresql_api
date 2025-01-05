import expres from 'express';
import { admin, customer, client } from '#clients';

const router = expres.Router();

router.get('/', async (req, res) => {
    try {
        const result = await client.query('SELECT * FROM navigation.menu_item');
        res.json(result.rows)
    } catch (error) {
        console.error('Error fetching navigation items:', error);
        res.status(500).json({ error: 'Failed to fetch navigation items' });
    }
});

export default router;
