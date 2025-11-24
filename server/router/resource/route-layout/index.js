import express from 'express';
import { ZodError } from 'zod/v4';

import RouteLayout from '#DAO/resource/RouteLayout.js';
import RouteLayoutClass from '#DAO/primitive/presentation/RouteLayoutClass.js';
import LayoutType from '#DAO/primitive/prototype/LayoutType.js';
import RouteLayoutInstanceTranslation from '#DAO/primitive/language/RouteLayoutInstanceTranslation.js'

import IdChecker from '#validation/api/general/IdChecker.js';
import { ValidateRouteLayoutInsert } from '#validation/api/resource/ValidateRouteLayout.js';

const router = express.Router();

router.get('/preset/:route_id', async (req, res) => {
    
    const id = Number(req.params.route_id);
    
    try {
        IdChecker.parse({ id });
        const selected = await RouteLayout.selectPreset(id);
        if (selected.error) return res.status(selected.status || 500).json(selected);
        const options = await LayoutType.selectList();
        if (options.error) return res.status(options.status || 500).json(options);
        res.json({
            data: {
                selected: selected.rows.at(0),
                options: options.rows
            }
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
    }
    
});

router.put('/preset/:route_id', async (req, res) => {
    
    const id = Number(req.params.route_id);
    const payload = req.body;

    try {
        IdChecker.parse({ id });
        ValidateRouteLayoutInsert.parse(payload);
        const result = await RouteLayoutClass.update(id, payload);
        if (result.error) return res.status(result.status || 500).json(result);
        return res.json({data: result.rows});
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
    }
    
});

router.delete('/preset/:route_id', async (req, res) => {
    
    const id = Number(req.params.route_id);

    try {
        IdChecker.parse({ id });
        const result = await RouteLayoutClass.delete(id);
        if (result.error) return res.status(result.status || 500).json(result);
        return res.json({data: result.rows});
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
    }
    
});

router.get('/properties/:route_id', async (req, res) => {
    
    const id = Number(req.params.route_id);
    
    try {
        IdChecker.parse({ id });
        const properties = await RouteLayout.selectProperties(id);
        if (properties.error) return res.status(properties.status || 500).json(properties);
        const preset = await LayoutType.select(properties.rows.at(0).layout_type_id);
        if (preset.error) return res.status(preset.status || 500).json(preset);
        res.json({
            data: {
                properties: properties.rows,
                preset: preset.rows
            }
        });
    } catch (error) {
        console.error(error)
        res.status(500).json({ error: 'Internal server error' });
    }
    
});

router.put('/properties/:route_id', async (req, res) => {
    
    const id = Number(req.params.route_id);
    const payload = req.body;

    try {
        IdChecker.parse({ id });
        const properties = await RouteLayoutInstanceTranslation.update(id, payload);
        if (properties.error) return res.status(properties.status || 500).json(properties);
        res.json({
            data: {
                properties: properties.rows
            }
        });
    } catch (error) {
        console.error(error)
        res.status(500).json({ error: 'Internal server error' });
    }
    
});

export default router;