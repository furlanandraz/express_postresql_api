import expres from 'express';
import clients from '#clients';

const router = expres.Router();

router.get('/', async (req, res) => {

    // const clientType = req.headers['x-client-type'];
    // const clientPool = clients[clientType];
    console.log(req.clientType)
    const client = clients[req.clientType];
    try {
        const result = await client.query('SELECT * FROM navigation.menu_item');
        res.json(result.rows)
    } catch (error) {
        console.error('Error fetching navigation items:', error);
        res.status(500).json({ error: 'Failed to fetch navigation items' });
    }
});

export default router;
