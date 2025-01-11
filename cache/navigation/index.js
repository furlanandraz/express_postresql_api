import createSubscriber from 'pg-listen';
import dotenv from 'dotenv';
dotenv.config();

import Navigation from '#DAO/Navigation.js'
import Cache from '#DAO/Cache.js';
import { buildMenuTree } from './functions.js';
import { god } from '#clients';


const subscriber = createSubscriber({
    connectionString: `postgres://${process.env.PG_GOD_USER}:${process.env.PG_GOD_PASSWORD}@${process.env.PG_SERVICE_HOST}:${process.env.PG_SERVICE_PORT}/${process.env.PG_SERVICE_NAME}`
    
});

subscriber.notifications.on('menu_item_change', async (payload) => {
    console.log(payload);
    
    try {

        const result = await Navigation.setClient('god').getMenuItems();
        const menuTree = buildMenuTree(result);
        await Cache.setClient('god').cacheMenuTree(menuTree)

        

    } catch (error) {
        console.error('Error updating cache table:', error);
        throw error;
    }
});

subscriber.events.on('error', (error) => {
    console.error('Fatal database connection error:', error);
    process.exit(1);
});

async function subscriberInit () {
    try {
        await subscriber.connect();
        console.log('Listening for notifications on channel: menu_item_change...');
        await subscriber.listenTo('menu_item_change');
    } catch (err) {
        console.error('Error setting up subscriber:', err);
    }
}

export default subscriberInit;
