import express from 'express';
import { ZodError } from 'zod/v4';

import { god } from '#clients';
import RouteItem from '#DAO/resource/RouteItem.js';
import IdChecker from '#validation/api/general/IdChecker.js';
import { ValidateRouteItemInsert, ValidateRouteItemUpdate } from '#validation/api/resource/ValidateRouteItem.js';
import rows2insert from '#DAO/functions/transformers/rows2insert.js';

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

router.post('/:id/generate-url', async (req, res) => {

    const id = Number(req.params.id) || null;

    try {
        IdChecker.parse({ id });
        const result = await RouteItem.generateURL(id);
        if (result.error) return res.status(result.status || 500).json(result);


        // to refactor ----------**-*-*

        const values = [];
        const params = [];
        
        result.forEach((row, i) => {
            values.push(`($${i * 4 + 1}, $${i * 4 + 2}, $${i * 4 + 3}, $${i * 4 + 4})`);
            params.push(
                row.route_id,
                row.language_code,
                row.path,
                JSON.stringify(row.breadcrumbs)
            );
        });

        const query = `
            UPDATE language.route_translation AS t
            SET
                path = v.path::text,
                breadcrumbs = v.breadcrumbs::json
            FROM (
                VALUES
                ${values.join(',\n')}
            ) AS v(route_id, language_code, path, breadcrumbs)
            WHERE t.route_id::int = v.route_id::int AND t.language_code::varchar(2) = v.language_code::varchar(2);
        `;

        await god.query(query, params);


        //------------*-*---

        return res.json({data: result});
    } catch (error) {
        console.log(error)
        if (error instanceof ZodError) return res.status(422).json({error: "Validation error", data: error.issues});
        res.status(500).json({ error: 'Internal server error' });
        console.log(error);
    }
    
});

export default router;