import express from 'express';
import publish from '#serverFunctions/subscribers/redisPublisher.js';
import Navigation from '#DAO/Navigation.js';
const router = express.Router();

import { validateBySchema } from '#serverFunctions/validators/validateBySchema.js';

router.get('/', async (req, res) => {

    publish.info({ message: 'refactored' });
    try {
        const menuItems = await Navigation.selectRouteItem();
        res.json(menuItems);
    } catch (error) {
        res.status(500).end();
    }
    
});

router.post('/', async (req, res) => {

    const data = req.body;

    const errors = validateBySchema('route', data);
    console.log(errors);

    try {
        await Navigation.insertRouteItem(data);
        res.status(202).end();
    } catch (error) {
        res.status(500).end();
    }
    
});

router.get('/:id', async (req, res) => {

    const id = Number(req.params.id);

    if (!Number.isInteger(id) || id < 1) return res.status(400).json({message: "Provide a positive integer!"});

    
    try {
        const menuItems = await Navigation.selectRouteItem(id);
        res.json(menuItems);
    } catch (error) {
        res.status(500).end();
    }

});

export default router;