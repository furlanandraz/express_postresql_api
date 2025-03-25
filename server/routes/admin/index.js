import expres from 'express';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

import Admin from '#DAO/Admin.js';
import { accessTokenSettings, refreshTokenSettings } from '#serverConfig/cookies.js';

const router = expres.Router();
dotenv.config()

const jwtSecret = process.env.JWT_SECRET;
const accessTokenTTL = process.env.JWT_ACCESS_TTL;
const refreshTokenTTL = process.env.JWT_REFRESH_TTL;


router.post('/login', async (req, res) => {
    const email = req.body.email;
    const password = req.body.password;
    try {
        const user = await Admin.login(email, password);

        const accessToken = jwt.sign(
            { id: user.id, role: user.role },
            jwtSecret,
            { expiresIn: accessTokenTTL }
        );

        const refreshToken = jwt.sign(
            { id: user.id },
            jwtSecret,
            { expiresIn: refreshTokenTTL }
        );

        res.cookie('accessToken', accessToken, delete accessTokenSettings.maxAge);

        res.cookie('refreshToken', refreshToken, delete refreshTokenSettings.maxAge);

        res.status(200).json({message: `Welcome user ${email}`});
    } catch (error) {
        console.log(error);
        res.status(500).end();
    }
});

router.post('/logout', (req, res) => {
    res.clearCookie('accessToken', {...accessTokenSettings, maxAge: undefined});
    res.clearCookie('refreshToken', {refreshTokenSettings, maxAge: undefined});
    res.status(200).json({ message: 'Logout successful' });
});

export default router;