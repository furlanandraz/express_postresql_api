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

export default router;