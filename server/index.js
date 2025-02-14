import express from 'express';
import dotenv from 'dotenv';
import { WebSocketServer, WebSocket } from 'ws';
import routes from './routes/index.js';
import getClientMiddleware from '#middleware/clientType.js';
import sysInfoWebSocket from './sysinfo/index.js';

dotenv.config();

const app = express();
const v = 1;
const entry = 'db';
const base = `/${entry}/v${v}`;
const PORT = process.env.API_SERVER_PORT||8000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use((req, res, next) => {
  req.locals = req.locals || {};
  next();
});

app.use(getClientMiddleware);

app.use(base, routes);

const server = app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

sysInfoWebSocket(server);