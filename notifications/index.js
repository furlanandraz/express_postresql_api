import { createClient } from "redis";

import dotenv from 'dotenv';
dotenv.config();

class Notifications {
    constructor() {
        this.client = createClient({
            url: `redis://${process.env.HOST}:${process.env.REDIS_PORT}`
        });
        this.channels = ['error', 'warning', 'info', 'success'];
        this.client.connect();
        this.client.on('error', (err) => {
            console.error('Redis Client Error', err);
        });
    }

    async publish(type, message) {
        try {

            if (!this.client) throw new Error('No redis client specified');
            if (!this.channels.includes(type)) throw new Error('Channel not recognised');
            if (!message || typeof message !== 'object') throw new Error('Payload must be an object');

            await this.client.publish(type, JSON.stringify(message));

        } catch (error) {
            console.log(error);
        }
    }

    async error(message) {
        await this.publish('error', message);
    }

    async warning(message) {
        await this.publish('warning', message);
    }

    async info(message) {
        await this.publish('info', message);
    }

    async success(message) {
        await this.publish('success', message);
    }
}

export default new Notifications();