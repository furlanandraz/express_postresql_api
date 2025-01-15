import express from 'express';
import dotenv from 'dotenv';

import routes from './routes/index.js';
import getClientMiddleware from '#middleware/clientType.js';

dotenv.config();

const server = express();

const v = 1;
const entry = 'db';
const base = `/${entry}/v${v}`;
const PORT = process.env.API_SERVER_PORT||8000;

server.use(express.json());
server.use(express.urlencoded({ extended: true }));

server.use((req, res, next) => {
  req.locals = req.locals || {};
  next();
});

server.use(getClientMiddleware);

server.use(base, routes);

server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});