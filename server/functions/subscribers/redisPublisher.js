import { createClient } from "redis";
import dotenv from "dotenv";
dotenv.config();

const channels = ["error", "warning", "info", "success"];

const client = createClient({
    url: `redis://${process.env.HOST}:${process.env.REDIS_PORT}`
});

client.connect().catch(err => {
    console.error("Redis connection error:", err);
});

client.on("error", (err) => {
    console.error("Redis Client Error:", err);
});

const publish = async (type, message) => {
    try {
        if (!client) throw new Error("No Redis client available");
        if (!channels.includes(type)) throw new Error(`Channel "${type}" not recognized`);
        if (typeof message !== "object" || message === null) {
            throw new Error("Message must be a non-null object");
        }
        await client.publish(type, JSON.stringify(message));
    } catch (error) {
        console.error("Notify Error:", error.message);
    }
};

// Attach helper methods for convenience
publish.error = (message) => publish("error", message);
publish.warning = (message) => publish("warning", message);
publish.info = (message) => publish("info", message);
publish.success = (message) => publish("success", message);

export default publish;