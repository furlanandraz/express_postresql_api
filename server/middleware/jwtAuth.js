import jwt from "jsonwebtoken";
import dotenv from 'dotenv';

import {accessTokenSettings} from '#serverConfig/cookies.js'

dotenv.config();

const secret = process.env.JWT_SECRET;
const accessTokenTTL = process.env.JWT_ACCESS_TTL;

export default function jwtAuth(options = {  base: '', skip: []}) {
    return function (req, res, next) {
      
        if (options.skip.length > 0 && options.skip.some((path) => req.path.replace(options.base, '').startsWith(path))) {
            return next();
        }

        const accessToken = req.cookies.accessToken;
        const refreshToken = req.cookies.refreshToken;

        try {
            const decodeAccess = jwt.verify(accessToken, secret);
            if (decodeAccess) {
                req.user = decodeAccess;
                next();
            }
        } catch (err) {

            if (!refreshToken) {
                return res.status(401).json({ error: 'Authentication required' });
            }

            try {
                const refreshDecoded = jwt.verify(refreshToken, secret);

                const newAccessToken = jwt.sign(
                    { id: refreshDecoded.id, role: refreshDecoded.role },
                    secret,
                    { expiresIn: accessTokenTTL }
                );

                res.cookie('accessToken', newAccessToken, accessTokenSettings);

                req.user = {
                    id: refreshDecoded.id,
                    role: refreshDecoded.role
                };

                return next();
            } catch (refreshErr) {
                console.log(err, refreshErr);
                return res.status(403).json({ error: 'Session expired' });
            }
        }
    }
}
