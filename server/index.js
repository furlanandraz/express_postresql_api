import express from 'express';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
import path from 'path';

import routes from './routes/index.js';
import services from './services/index.js';
import jwtAuth from '#middleware/jwtAuth.js';



dotenv.config();

const app = express();
const v = 1;
const entry = 'db';
const base = `/${entry}/v${v}`;
const PORT = process.env.API_SERVER_PORT||8000;



app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use('/static', express.static(path.join(process.cwd(), 'static')));

app.use(jwtAuth({
    base,
    skip: [
        '/admin/login',
        '/client'
    ]    
}));

app.use(base, routes);

const server = app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

services(server);