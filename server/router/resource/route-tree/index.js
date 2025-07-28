import express from 'express';
import RouteTree from '#DAO/resource/RouteTree.js';

const router = express.Router();

router.get('/', async (req, res) => {

    try {
        const result = await RouteTree.select();
        if (result.error) return res.status(result.status || 500).json(result);
        res.json({ data: result });
    } catch (error) {
        res.status(500).json({ error: 'Internal server error' });
    }
    
});

export default router;