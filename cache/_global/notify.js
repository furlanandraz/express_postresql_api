import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { god } from '#clients';
import pg_notify from './notifications.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const triggers_query = fs.readFileSync(path.join(__dirname, 'triggers.sql'), 'utf-8');

(async () => {
    try {
        const triggersQuery = await god.query(triggers_query);
        const triggers = triggersQuery.rows;
        for (const trigger of triggers) {
            try {
                const notificationQuery = pg_notify(trigger.function_name, { "payload": "force caching" });
                console.log(notificationQuery);
                await god.query(notificationQuery);
            } catch (error) {
                throw new Error(`Failed to perform notification on ${trigger.function_name}: ${error}`);
            }
        };
    } catch (error) {
        console.error(`Failed to fetch triggers: ${error}`);
        process.exit(1);
    } finally {
        console.log('Caching done');
    }
})();