import {WebSocketServer} from 'ws';
import getSysInfo from '#serverFunctions/getSysInfo.js';


export default function services(server) {
    new WebSocketService(server, 'sysinfo', getSysInfo, 1000);
}

class WebSocketService {
    constructor(server, path, callback, interval = null){
        this.server = server;
        this.path = typeof path === 'string' ? path : path.join('/');
        this.callback = callback;
        this.interval = interval;
        this.timer = null;
        this.start();
    }

    start() {
        const wss = new WebSocketServer({ noServer: true, path: `/${this.path}` });

        this.server.on('upgrade', (req, socket, head) => {
            this.server.on('error', (err) => console.log('Pre-Upgrade Error:', err));
            wss.handleUpgrade(req, socket, head, (ws) => {
                wss.emit('connection', ws, req);
            });
        });

        wss.on('connection', async (ws) => {
            console.log('Client connected to /sysinfo WebSocket');
            if (ws.readyState === ws.OPEN) {
                this.callback()
            }

            if (this.interval) {
                this.timer = setInterval(async () => {
                    ws.send(JSON.stringify(await this.callback()));
                }, this.interval); 
            } else {
                ws.send(JSON.stringify(await this.callback()));
            }
            
            ws.on('error', (err) => console.log('Post-Upgrade Error:', err));
    
            ws.on('close', () => {
                if (timer) clearInterval(this.timer);
                console.log('Client disconnected from /sysinfo');
            });
        });
    }
}
