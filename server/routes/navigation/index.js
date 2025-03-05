import expres from 'express';
import Navigation from '#DAO/Navigation.js';

const router = expres.Router();

router.get('/get-menu-items', async (req, res) => {
    try {
        const menuItems = await Navigation.getMenuItems();
        res.json(menuItems);
    } catch (error) {
        res.status(500);
    }
});

router.put('/generate-links', async (req, res) => {
    try {
        const links = await Navigation.generateURLs();
        res.json(links);
    } catch (error) {
        res.status(500);
    }
});

export default router;
