import expres from 'express';
import Client from '#DAO/Client.js';

const router = expres.Router();

router.get('/layout-build', async (req, res) => {
    const id = req.query.id;
    try {
        const build = await Client.layoutBuild(id);
        res.json(build);
    } catch (error) {
        res.status(500);
    }
});

router.get('/layout-data', async (req, res) => {
    const id = req.query.id;
    try {
        const data = await Client.layoutData(id);
        res.json(data);
    } catch (error) {
        res.status(500);
    }
});

router.get('/page-build', async (req, res) => {
    const id = req.query.id;
    try {
        const data = await Client.pageBuild(id);
        res.json(data);
    } catch (error) {
        res.status(500);
    }
});

router.get('/page-data', async (req, res) => {
    const id = req.query.id;
    try {
        const data = await Client.pageData(id);
        res.json(data);
    } catch (error) {
        res.status(500);
    }
});

router.get('/topic-build', async (req, res) => {
    const id = req.query.id;
    try {
        const data = await Client.topicBuild(id);
        res.json(data);
    } catch (error) {
        res.status(500);
    }
});

router.get('/topic-data', async (req, res) => {
    const url = decodeURIComponent(req.query.url);
    
    try {
        const data = await Client.topicData(url);
        res.json(data);
    } catch (error) {
        res.status(500);
    }
});

export default router;
