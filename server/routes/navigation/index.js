import expres from 'express';
import Navigation from '#DAO/Navigation.js';
import Cache from '#DAO/Cache.js';
import publish from '#serverFunctions/subscribers/redisPublisher.js';

const router = expres.Router();

router.get('/get-route-items', async (req, res) => {
    
    publish.info({ message: 'refactored' });
    try {
        const menuItems = await Navigation.getRouteItems();
        res.json(menuItems);
    } catch (error) {
        res.status(500).end();
    }
});

router.post('/update-route-items', async (req, res) => {
    
    // console.log(req.body);
    // update route items with diffed objects
    // update links
    // update menu cache
    res.status(200).end();
});

router.get('/get-route-tree', async (req, res) => {
   
    publish.info({ message: 'refactored' });
    try {
        const menuItems = await Navigation.getRouteTree();
        res.json(menuItems);
    } catch (error) {
        res.status(500).end();
    }
});

router.put('/generate-urls', async (req, res) => {
    try {
        await Navigation.generateURLs();
        await Cache.updateRouteTree();
        res.status(200).end();
    } catch (error) {
        res.status(500).end();
    }
});

export default router;
