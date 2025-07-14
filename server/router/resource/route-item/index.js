import express from 'express';
import { ZodError } from 'zod/v4';
import RouteItem from '#DAO/resource/RouteItem.js';
import IdChecker from '#validation/api/general/IdChecker.js';
import {ValidateRouteItemInsert, ValidateRouteItemUpdate} from '#validation/api/resource/ValidateRouteItem.js';

const router = express.Router();

router.get('/', async (req, res) => {
    
    try {
        const result = await RouteItem.select();
        if (result.error) return res.status(result.status || 500).json(result);
        res.json({data: result.rows});
    } catch (error) {
        res.status(500).json({ error: 'Internal server error' });
    }
    
});


router.get('/:id', async (req, res) => {
  
    const id = Number(req.params.id);

    try {
        IdChecker.parse({ id });
        const result = await RouteItem.select(id);
        if (result.error) return res.status(result.status || 500).json(result);
        return res.json({data: result.rows});
    } catch (error) {
        if (error instanceof ZodError) return res.status(422).json({error: "Validation error", data: error.issues});
        res.status(500).json({ error: 'Internal server error' });
    }
});


router.post('/', async (req, res) => {

    const payload = req.body;

    try {
        ValidateRouteItemInsert.parse(payload);
        const result = await RouteItem.insert(payload);
        if (result.error) return res.status(result.status || 500).json(result);
        return res.json({data: result});
    } catch (error) {
        if (error instanceof ZodError) return res.status(422).json({error: "Validation error", data: error.issues});
        res.status(500).json({ error: 'Internal server error' });
        console.log(error);
    }
    
});

router.put('/', async (req, res) => {

    const payload = req.body;

    try {
        ValidateRouteItemUpdate.parse(payload);
        const result = await RouteItem.update(payload);
        if (result.error) return res.status(result.status || 500).json(result);
        return res.json({data: result});
    } catch (error) {
        if (error instanceof ZodError) return res.status(422).json({error: "Validation error", data: error.issues});
        res.status(500).json({ error: 'Internal server error' });
        console.log(error);
    }
    
});

export default router;