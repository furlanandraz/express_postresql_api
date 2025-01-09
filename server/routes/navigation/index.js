import expres from 'express';
import Navigation from '#DAO/Navigation.js';

const router = expres.Router();

router.get('/get-menu-items', async (req, res) => {

    const { clientType } = req.locals;
    try {
        const menuItems = await Navigation.setClient(clientType).getMenuItems();
        res.json(menuItems);
    } catch (error) {
        res.status(500);
    }
});

export default router;
