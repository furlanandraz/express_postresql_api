import express from 'express';

import routes from './routes/index.js';
import getClientMiddleware from '#middleware/clientType.js';

const server = express();

const v = 1;
const entry = 'db';
const base = `/${entry}/v${v}`;

server.use(express.json());
server.use(express.urlencoded({ extended: true }));

server.use((req, res, next) => {
  req.locals = req.locals || {};
  next();
});

server.use(getClientMiddleware);

server.use(base, routes);

export default server;