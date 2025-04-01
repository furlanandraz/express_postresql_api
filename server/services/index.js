import { WebSocketServer } from 'ws';
import cookie from 'cookie';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';


dotenv.config();

const secret = process.env.JWT_SECRET;

import sysInfo from '#serverFunctions/pollers/sysInfo.js';
import redisSubscriber from '#serverFunctions/subscribers/redisSubscriber.js';

export default function services(server) {
    const service = new WebSocketService(server);

    service.register('sys-info', sysInfo);
    service.register('cms-notif', redisSubscriber);
}

class WebSocketService {
    constructor(server){
        this.server = server;
        this.routes = {};
        this.wss = new WebSocketServer({ noServer: true });
        this.#start();

        setInterval(() => {
            this.wss.clients.forEach((ws) => {
                if (!ws.isAlive) return ws.terminate();
                ws.isAlive = false;
                ws.ping();
            });
        }, 30000);
    }

    

    register(channel, callback) {
        this.routes[`services/${channel}`] = callback;
    }

    #start() {

        this.server.on('error', (err) => console.log('Server error:', err))

        this.server.on('upgrade', (req, socket, head) => {

            this.server.on('error', (err) => console.log('Post-Upgrade Error:', err));

            const path = req.url.replace(/^\/+/g, '');

            if (!this.routes[path]) {
                console.log(`WebSocket path ${path} not found`);
                socket.destroy();
                return;
            }
           
            try {
                const cookies = cookie.parse(req.headers.cookie || '');
                const refreshToken = cookies.refreshToken;

                if (!refreshToken) {
                    socket.write('HTTP/1.1 401 Unauthorized\r\n\r\n');
                    socket.destroy();
                    return;
                }

                const decoded = jwt.verify(refreshToken, secret);
                req.user = decoded;

                this.wss.handleUpgrade(req, socket, head, (ws) => {
                    this.wss.emit('connection', ws, req, path);
                });

            } catch (err) {
                console.log('WebSocket auth failed:', err.message);
                socket.write('HTTP/1.1 403 Forbidden\r\n\r\n');
                socket.destroy();
            }

        });

        this.wss.on('connection', async (ws, req, path) => {
            console.log(`Client connected to /${path}`);
            if (ws.readyState === ws.OPEN) {
                this.routes[path](ws);
            }

            ws.isAlive = true;

            ws.on('pong', () => {
                ws.isAlive = true;
            });

            ws.on('error', (err) => {
                console.log('Connection Error:', err);
                
            });
            ws.on('close', () => {
                console.log(`Client disconnected from ${path}`);
                
            });
        });
    }
}
