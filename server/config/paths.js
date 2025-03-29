import dotenv from 'dotenv';

dotenv.config()

const domain = process.env.DOMAIN;

export const paths = {
    login: `${domain}/login`
}