import expres from 'express';
import Presentation from '#DAO/Presentation.js';

const router = expres.Router();

router.get('/get-page-content', async (req, res) => {
    const { clientType } = req.locals;
    const id = req.query.id;
    if (!id) return res.status(400).json({ error: "Missing page ID" });
    try {
        const pageContent = await Presentation.setClient(clientType).getPageContentById(id);
        res.json(pageContent);
    } catch (error) {
        res.status(500);
    }
});

router.get('/get-page-layout', async (req, res) => {
    const { clientType } = req.locals;
    const id = req.query.id;
    if (!id) return res.status(400).json({ error: "Missing page ID" });
    try {
        const pageContent = await Presentation.setClient(clientType).getPageLayoutById(id);
        res.json(pageContent);
    } catch (error) {
        res.status(500);
    }
});

router.put('/render-template-schema', async (req, res) => {
    const { clientType } = req.locals;
    const id = req.query.id;
    if (!id) return res.status(400).json({ error: "Missing page ID" });
    try {
        const result = await Presentation.setClient(clientType).renderTemplateSchemaById(id);
        if (result?.error) {
            return res.status(500).json(result); 
        }
        res.json(result);
    } catch (error) {
        res.status(500);
    }

});

router.put('/render-layout-schema', async (req, res) => {
    const { clientType } = req.locals;
    const id = req.query.id;
    if (!id) return res.status(400).json({ error: "Missing page ID" });
    try {
        const result = await Presentation.setClient(clientType).renderLayoutSchemaById(id);
        if (result?.error) {
            return res.status(500).json(result); 
        }
        res.json(result);
    } catch (error) {
        res.status(500);
    }

});

export default router;