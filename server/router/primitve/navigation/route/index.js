import express from 'express';
import publish from '#serverFunctions/subscribers/redisPublisher.js';
import Route from '#DAO/primitive/navigation/Route.js';
import { z } from 'zod/v4';
const router = express.Router();



router.get('/', async (req, res) => {
    
    try {
        const result = await Route.select();
        if (result.rows) return res.json(result);
        else if (result.error) throw new Error(result.error);
        
    } catch (error) {
        res.status(500).json({error});
    }
    
});



router.get('/:id', async (req, res) => {

    /*const id = Number(req.params.id);

    if (!Number.isInteger(id) || id < 1) return res.status(400).json({message: "Provide a positive integer!"});*/

    
    try {
        Route.parse({ id }); //new
        const menuItems = await Navigation.selectRouteItem(id);
        res.json(menuItems);
    } catch (error) {
        if(error instanceof z.ZodError) res.status(422).json(error)
        res.status(500).json({error});;
    }

});

export default router;

router.post('/', async (req, res) => {

    const data = req.body;

    const errors = validateBySchema('route', data);
    console.log('errors:', errors);

    try {
        await Navigation.insertRouteItem(data);
        res.status(202).end();
    } catch (error) {
        res.status(500).end();
    }
    
});

