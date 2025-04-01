import expres from 'express';
import Navigation from '#DAO/Navigation.js';
import publish from '#serverFunctions/subscribers/redisPublisher.js';

const router = expres.Router();

router.get('/get-menu-items', async (req, res) => {
    
    publish.info({ message: 'refactored' });
    try {
        const menuItems = await Navigation.getMenuItems();
        res.json(menuItems);
    } catch (error) {
        res.status(500).end();
    }
});

router.get('/get-menu-tree', async (req, res) => {
    
    publish.info({ message: 'refactored' });
    try {
        const menuItems = await Navigation.getMenuTree();
        res.json(menuItems);
    } catch (error) {
        res.status(500).end();
    }
});

router.put('/generate-links', async (req, res) => {
    try {
        const links = await Navigation.generateURLs();
        res.json(links);
    } catch (error) {
        res.status(500).end();
    }
});

export default router;
