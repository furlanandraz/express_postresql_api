import expres from 'express';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

import Auth from '#DAO/Auth.js';
import { accessTokenSettings, refreshTokenSettings, permissionCookieSettings } from '#serverConfig/cookies.js';
import permissions from '#serverConfig/permissions.js';

const router = expres.Router();
dotenv.config()

const jwtSecret = process.env.JWT_SECRET;
const accessTokenTTL = process.env.JWT_ACCESS_TTL;
const refreshTokenTTL = process.env.JWT_REFRESH_TTL;


router.post('/login', async (req, res) => {
    const email = req.body.email;
    const password = req.body.password;
    
    if (!email || !password) return res.status(404).json({ error: 'Missing credentials' });

    try {
        const user = await Auth.login(email, password);
        
        const userPermissions = JSON.stringify(permissions.find(option => option.role === user.role)?.permissions);

        if (!user) return res.status(400).json({ error: 'Login Failed' });
        if (!user.emailOk) return res.status(404).json({ error: 'User not found' });
        if (!user.passOk) return res.status(404).json({ error: 'Invalid password' });
        
        const accessToken = jwt.sign(
            { id: user.id, role: user.role, email: user.email },
            jwtSecret,
            { expiresIn: accessTokenTTL }
        );

        const refreshToken = jwt.sign(
            { id: user.id, role: user.role, email: user.email },
            jwtSecret,
            { expiresIn: refreshTokenTTL }
        );

        res.cookie('accessToken', accessToken, accessTokenSettings);

        res.cookie('refreshToken', refreshToken, refreshTokenSettings);

        res.cookie('permissions', userPermissions, permissionCookieSettings);

        res.status(200).json({
            message: `Welcome user ${email}`,
            data: {
                user: {
                    email: user.email,
                    permissions: userPermissions
                }
            }
        });
        
    } catch (error) {
        console.log(error);
        res.status(500).json({error: 'Login Failed'});
    }
});

router.get('/permission-check', (req, res) => {
    const route = req.query.route;

    if (!route) return res.status(400).json({ error: 'No route specified' });

    const list = permissions.find(option => option.role === req.user.role)?.permissions || [];
    const grant = list.includes(route);

    if (grant) return res.status(200).end()
    return res.status(403).json({ error: 'Access denied' });

});

router.get('/refresh', (req, res) => {
  
    const user = req.user;
    const userPermissions = JSON.stringify(permissions.find(option => option.role === user.role)?.permissions);
    res.status(200).json({
        message: `Hello there ${user.email}`,
        data: {
            user: {
                email: user.email,
                permissions: userPermissions
            }
        }
    });
});

router.post('/logout', (req, res) => {
    res.clearCookie('accessToken', {...accessTokenSettings, maxAge: undefined});
    res.clearCookie('refreshToken', {refreshTokenSettings, maxAge: undefined});
    res.clearCookie('permissions', {permissionCookieSettings, maxAge: undefined});
    res.status(200).json({ message: 'Logout successful' });
});

export default router;