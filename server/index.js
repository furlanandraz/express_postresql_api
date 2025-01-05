import express from 'express';

import { navigation } from '#routes/navigation';

const server = express();

const v = 1;
const entry = 'db';
const base = `/${entry}/v${v}`;


server.use(express.json());
server.use(express.urlencoded({ extended: true }));

// routes
server.use(`${base}/navigation`, navigation)

export default server;