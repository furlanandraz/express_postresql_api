import createSubscriber from 'pg-listen';
import { god } from '#clients';

const subscriber = createSubscriber({
    pgClient: god
});

subscriber.notifications.on('menu_item_change', async (payload) => {
    try {
        const menuItems = await god.query('SELECT * FROM navigation.menu_item');
        res.json(menuItems);
    } catch (error) {
        res.status(500);
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
