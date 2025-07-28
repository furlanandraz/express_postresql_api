import express from 'express';
import { ZodError } from 'zod/v4';

import Language from '#DAO/primitive/settings/Language.js';
import { ValidateLanguage } from '#validation/api/primitive/settings/ValidateLanguage.js'


const router = express.Router();



router.get('/', async (req, res) => {
    
    const payload = {
        code: req.query.code ?? null,
        is_enabled: req.query.is_enabled ?? null,
        is_default: req.query.is_default ?? null
    };

    try {
        ValidateLanguage.parse(payload);
        const result = await Language.select(payload);
        if (result.error) return res.status(result.status || 500).json(result);
        return res.json({data: result.rows});
    } catch (error) {
        if (error instanceof ZodError) return res.status(422).json(error)
        res.status(500).json({ error: 'Internal server error' });
    }
    
});

router.patch('/:code/set-enabled', async (req, res) => {

    const code = req.params.code;
    const is_enabled = req.query.is_enabled || 'true';

    try {
        ValidateLanguage.parse({ code, is_enabled });
        const result = await Language.setEnabled(code, is_enabled);
        if (result.error) return res.status(result.status || 500).json(result);
        return res.json({ data: result.rows });
    } catch (error) {
        if (error instanceof ZodError) return res.status(422).json({error: error.message});
        res.status(500).json({ error: 'Internal server error' });
    }

});

router.patch('/:code/set-default', async (req, res) => {
    
    const code = req.params.code;

    try {
        ValidateLanguage.parse({ code });
        const result = await Language.setDefault(code);
        if (result.error) return res.status(result.status || 500).json(result);
        return res.json({ data: result.rows });
    } catch (error) {
        if (error instanceof ZodError) return res.status(422).json({error: error.message});
        res.status(500).json({ error: 'Internal server error' });
    }

});

export default router;

