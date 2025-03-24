import jwt from "jsonwebtoken";
import dotenv from 'dotenv';


dotenv.config();

const secret = process.env.JWT_SECRET;

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
                    { expiresIn: '1h' }
                );

                res.cookie('accessToken', newAccessToken, {
                    httpOnly: false,
                    secure: false,
                    sameSite: 'Strict',
                    maxAge: 15 * 60 * 1000
                });

                req.user = {
                    id: refreshDecoded.id,
                    role: refreshDecoded.role
                };

                return next();
            } catch (refreshErr) {
                return res.status(403).json({ error: 'Session expired' });
            }
        }
    }
}
