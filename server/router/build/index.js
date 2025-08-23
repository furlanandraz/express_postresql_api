import express from 'express';

import Build from '#DAO/adapter/Build.js';
import IdChecker from '#validation/api/general/IdChecker.js';

const router = express.Router();

router.get('/navigation', async (req, res) => {
    
    try {
        const result = await Build.navigation();
        if (result.error) return res.status(result.status || 500).json(result);
        res.json({data: result});
    } catch (error) {
        res.status(500).json({ error: 'Internal server error' });
    }
    
});

export default router;