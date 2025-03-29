import jwt from "jsonwebtoken";
import dotenv from 'dotenv';

import { accessTokenSettings } from '#serverConfig/cookies.js';
import { paths } from "#serverConfig/paths.js";

dotenv.config();

const secret = process.env.JWT_SECRET;
const accessTokenTTL = process.env.JWT_ACCESS_TTL;

export default function jwtAuth(options = { base: '', skip: [] }) {
  return function (req, res, next) {
    const accessToken = req.cookies.accessToken;
    const refreshToken = req.cookies.refreshToken;

    if (
      options.skip.length > 0 &&
      options.skip.some((path) =>
        req.path.replace(options.base, '').startsWith(path)
      )
    ) {
      return next();
    }

    // ✅ First try access token
    if (accessToken) {
      try {
        const decoded = jwt.verify(accessToken, secret);
        req.user = decoded;
        return next();
      } catch (err) {
        console.log('[JWT] Access token invalid:', err.message);
      }
    }

    if (refreshToken) {
      try {
        const decodedRefresh = jwt.verify(refreshToken, secret);
        const { exp, iat, ...payload } = decodedRefresh;

        const newAccessToken = jwt.sign(payload, secret, {
          expiresIn: accessTokenTTL,
        });

        res.cookie('accessToken', newAccessToken, accessTokenSettings);
        req.user = payload;

        return next();
      } catch (err) {
        console.error('[JWT] Refresh token invalid:', err.message);
        return res.status(403).json({ error: 'Session expired' });
      }
    }

    return res.status(401).json({ error: 'Authentication required' });
  };
}

