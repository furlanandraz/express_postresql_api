import express from 'express';
import { ZodError } from 'zod/v4';
import RouteItem from '#DAO/resource/RouteItem.js';
import IdChecker from '#validation/api/general/IdChecker.js';
import {ValidateRouteItemInsert, ValidateRouteItemUpdate} from '#validation/api/resource/ValidateRouteItem.js';

const router = express.Router();



// zod validation of route

router.get('/', async (req, res) => {

    //res accepted 202 + ws 202

    //use zod object

    //err -> ws 422

    //pass to db

    //err -> ws 500

    //publish.info({ message: 'refactored' }); // + invalidate querry

    
    try {
        const result = await RouteItem.select();
        res.json({data: result});
    } catch (error) {
        res.status(500).end();
    }
    
});


router.get('/:id', async (req, res) => {
  
    const id = Number(req.params.id);

    try {
        IdChecker.parse({ id });
        const result = await RouteItem.select(id);
        return res.json({data: result});
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
        if (result.error) return res.status(500).json(result);
        return res.json({data: result});
    } catch (error) {
        if (error instanceof ZodError) return res.status(422).json({error: "Validation error", data: error.issues});
        res.status(500).json({ error: 'Internal server error' });
        console.log(error);
    }
    
});

export default router;