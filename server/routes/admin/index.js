import expres from 'express';
import jwt from 'jsonwebtoken';
import ms from "ms";

import Admin from '#DAO/Admin.js';

const router = expres.Router();

const jwtSecret = process.env.JWT_SECRET;
const accessTokenTTL = process.emit.JWT_ACCESS_TTL;
const refreshTokenTTL = process.emit.JWT_REFRESH_TTL;


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

        res.cookie('accessToken', accessToken, {
            httpOnly: false,
            secure: false,
            sameSite: 'Strict',
            maxAge: ms(accessTokenTTL)
        });

        res.cookie('refreshToken', refreshToken, {
            httpOnly: true,
            secure: false,
            sameSite: 'Strict',
            maxAge: ms(refreshTokenTTL)
        });

        res.status(200).json({message: `Welcome user ${email}`});
    } catch (error) {
        console.log(error);
        res.status(500).end();
    }
});

export default router;