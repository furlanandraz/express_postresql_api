import expres from 'express';
import nav from './dao.js';

const router = expres.Router();

router.get('/', async (req, res) => {

    const { clientType } = req.locals;
    try {
        const menuItems = await nav.getMenuItems(clientType);
        res.json(menuItems);
    } catch (error) {
        console.error('Error fetching navigation items:', error);
        res.status(500).json({ error: 'Failed to fetch navigation items' });
    }
});

export default router;
