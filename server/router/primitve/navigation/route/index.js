import express from 'express';
import { ZodError } from 'zod/v4';

import Route from '#DAO/primitive/navigation/Route.js';
import IdChecker from '#validation/api/general/IdChecker.js';
import ValidateRoute from '#validation/api/primitive/navigation/ValidateRoute.js';

const router = express.Router();

router.get('/', async (req, res) => {
    
    try {
        const result = await Route.select();
        if (result.error) return res.status(result.status || 500).json(result);
        return res.json({data: result.rows});
    } catch (error) {
        res.status(500).json({ error: 'Internal server error' });
    }
    
});

router.get('/:id', async (req, res) => {

    const id = Number(req.params.id);

    try {
        IdChecker.parse({ id });
        const result = await Route.select(id);
        if (result.error) return res.status(result.status || 500).json(result);
        return res.json({data: result.rows});
    } catch (error) {
        if (error instanceof ZodError) return res.status(422).json(error)
        res.status(500).json({ error: 'Internal server error' });
    }

});

router.put('/', async (req, res) => {
   
    const payload = req.body;
    
    try {
        ValidateRoute.parse(payload);
        
        const result = await Route.update(payload);
        if (result.error) return res.status(result.status || 500).json(result);
        return res.json({ data: result.rows });
        
    } catch (error) {
        if (error instanceof ZodError) return res.status(422).json({ error: "Validation error", data: error.issues });
        res.status(500).json({ error: 'Internal server error' });
    }

});

router.delete('/:id', async (req, res) => {
   
    const id = Number(req.params.id);

    try {
        IdChecker.parse({ id });
        const result = await Route.delete(id);
        if (result.error) return res.status(result.status || 500).json(result);
        return res.json({ data: result.rows });
    } catch (error) {
        if (error instanceof ZodError) return res.status(422).json({ error: "Validation error", data: error.issues });
        res.status(500).json({ error: 'Internal server error' });
    }

});

export default router;