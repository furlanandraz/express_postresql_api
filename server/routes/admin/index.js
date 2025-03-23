import expres from 'express';
import Admin from '#DAO/Admin.js';

const router = expres.Router();

router.post('/login', async (req, res) => {
    const email = req.body.email;
    const password = req.body.password;
    try {
        const user = await Admin.login(email, password);
        console.log(user);
        res.json(user);
    } catch (error) {
        console.log(error);
        res.status(500).end();
    }
});

export default router;