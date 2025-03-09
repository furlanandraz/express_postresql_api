import expres from 'express';
import Presentation from '#DAO/Presentation.js';

const router = expres.Router();

router.get('/get-route-content', async (req, res) => {
    const id = req.query.id;
    try {
        const pageContent = await Presentation.getRouteContentById(id);
        res.json(pageContent);
    } catch (error) {
        res.status(500);
    }
});

router.get('/get-route-layout', async (req, res) => {
    const id = req.query.id;
    try {
        const pageContent = await Presentation.getRouteLayoutById(id);
        res.json(pageContent);
    } catch (error) {
        res.status(500);
    }
});

router.get('/get-route-topic', async (req, res) => {
    const id = req.query.id;
    try {
        const pageContent = await Presentation.getTopicByRouteId(id);
        res.json(pageContent);
    } catch (error) {
        res.status(500);
    }
});

router.get('/get-topic', async (req, res) => {
    const id = req.query.id;
    try {
        const pageContent = await Presentation.getTopicById(id);
        res.json(pageContent);
    } catch (error) {
        res.status(500);
    }
});

router.put('/render-template-schema', async (req, res) => {
    const id = req.query.id;
    try {
        const result = await Presentation.renderTemplateSchemaById(id);
        if (result?.error) {
            return res.status(500).json(result); 
        }
        res.json(result);
    } catch (error) {
        res.status(500);
    }

});

router.put('/render-layout-schema', async (req, res) => {
    const id = req.query.id;
    try {
        const result = await Presentation.renderLayoutSchemaById(id);
        if (result?.error) {
            return res.status(500).json(result); 
        }
        res.json(result);
    } catch (error) {
        res.status(500);
    }

});

export default router;