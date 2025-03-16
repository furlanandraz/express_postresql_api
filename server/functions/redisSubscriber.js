import { createClient } from "redis";
import dotenv from 'dotenv';
dotenv.config();

export default async function redisSubscriber(ws) {
    try {
        const client = createClient({
            url: `redis://${process.env.HOST}:${process.env.REDIS_PORT}`
        });

        await client.connect();

        client.on("error", (err) => {
            console.error("Redis Subscriber Error:", err);
        });

        const channels = ["error", "warning", "info", "success"]; // List of channels to subscribe to

        channels.forEach(channel => {
            client.subscribe(channel, (message) => {
                if (ws.readyState === ws.OPEN) {
                    ws.send(JSON.stringify({ type: channel, message }));
                }
            });
        });

        ws.on("close", async () => {
            console.log("Client disconnected from /notifications WebSocket");
            await client.quit(); // Close Redis connection
        });

    } catch (error) {
        console.error("Error setting up Redis subscriber:", error);
    }
}