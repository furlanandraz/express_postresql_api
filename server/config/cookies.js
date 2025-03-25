import ms from "ms";
import dotenv from 'dotenv';

dotenv.config()

const accessTokenTTL = process.env.JWT_ACCESS_TTL;
const refreshTokenTTL = process.env.JWT_REFRESH_TTL;

export const accessTokenSettings = {
    httpOnly: false,
    secure: false,
    sameSite: 'Strict',
    maxAge: ms(accessTokenTTL)
}

export const refreshTokenSettings = {
    httpOnly: true,
    secure: false,
    sameSite: 'Strict',
    maxAge: ms(refreshTokenTTL)
}