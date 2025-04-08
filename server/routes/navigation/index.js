import expres from 'express';
import { diff as allDiff, addedDiff, deletedDiff, updatedDiff } from 'deep-object-diff';
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
    console.log('hit')
    console.log(req.body);
    try {
        const trueItems = await Navigation.getRouteTree();
        if (JSON.stringify(trueItems) !== JSON.stringify(req.body.tree))
            return res.status(409).json({ error: 'Conflicting original and proposed route items' });
        
        if (JSON.stringify(trueItems) === JSON.stringify(req.body.treeLatent))
            return res.status(204).json({ message: 'No changes detected between original and proposed route items' });
        

        console.log('diff start')
        const diff = allDiff(req.body.tree, req.body.treeLatent);
        console.log('diff', JSON.stringify(diff, null, 2));
        const added = addedDiff(req.body.tree, req.body.treeLatent);
        console.log('added', JSON.stringify(added, null, 2));
        const deleted = deletedDiff(req.body.tree, req.body.treeLatent);
        console.log('deleted', JSON.stringify(deleted, null, 2));
        const updated = updatedDiff(req.body.tree, req.body.treeLatent);
        console.log('updated', JSON.stringify(updated, null, 2));
        console.log('diff end')
        
        res.status(200).end()
    } catch (err) {
        console.error(err);
        res.status(500).end();
    } finally {
        // Navigation.generateURLs();
        // Cache.updateRouteTree();
    }
    // update route items with diffed objects
    // update links
    // update menu cache
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
        res.status(200).json({message: 'URLs generated successfully'});
    } catch (error) {
        res.status(500).end();
    } finally {
        await Cache.updateRouteTree();
    }
});

export default router;
