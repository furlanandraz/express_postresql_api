import { WebSocketServer } from 'ws';

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
    }

    register(channel, callback) {
        this.routes[channel] = callback;
    }

    #start() {

        this.server.on('error', (err) => console.log('Server error:', err))

        this.server.on('upgrade', (req, socket, head) => {
            this.server.on('error', (err) => console.log('Pre-Upgrade Error:', err));

            const path = req.url.replace(/^\/+/g, '');

            if (this.routes[path]) {
                this.wss.handleUpgrade(req, socket, head, (ws) => {
                    this.wss.emit('connection', ws, req, path);
                });
            } else {
                console.log(`WebSocket path ${path} not found`);
                socket.destroy();
            }
        });

        this.wss.on('connection', async (ws, req, path) => {
            console.log(`Client connected to /${path}`);
            if (ws.readyState === ws.OPEN) {
                this.routes[path](ws);
            }
            ws.on('error', (err) => console.log('Post-Upgrade Error:', err));
            ws.on('close', () => console.log(`Client disconnected from ${path}`));
        });
    }
}
