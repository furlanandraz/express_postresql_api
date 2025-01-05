import express from 'express';

import routes from './routes/index.js';

const server = express();

const v = 1;
const entry = 'db';
const base = `/${entry}/v${v}`;

server.use(express.json());
server.use(express.urlencoded({ extended: true }));

server.use(base, routes);

export default server;