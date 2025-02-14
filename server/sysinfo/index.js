import {WebSocketServer} from 'ws';
import { getSysInfo } from '#serverFunctions/getSysInfo.js';

export default function sysInfoWebSocket(server) {
    const wss = new WebSocketServer({ noServer: true, path: '/sysinfo' });
    
    server.on('upgrade', (req, socket, head) => {
      socket.on('error', (err) => console.log('Pre-Upgrade Error:', err));
      wss.handleUpgrade(req, socket, head, (ws) => {
        wss.emit('connection', ws, req);
      });
    });
    
    
    wss.on('connection', (ws) => {
      console.log('Client connected to /sysinfo WebSocket');
    
      const interval = setInterval(async () => {
        if (ws.readyState === ws.OPEN) {
          ws.send(JSON.stringify(await getSysInfo()));
        }
      }, 1000);
    
      ws.on('error', (err) => console.log('Post-Upgrade Error:', err));
    
      ws.on('close', () => {
        clearInterval(interval);
        console.log('Client disconnected from /sysinfo');
      });
    });
}