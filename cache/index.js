import createSubscriber from 'pg-listen';
import { god } from '#clients';

const subscriber = createSubscriber({
    pgClient: god
});

subscriber.notifications.on('menu_item_change', (payload) => {
    console.log('Received menu item change notification:', payload);
});

subscriber.events.on('error', (error) => {
    console.error('Fatal database connection error:', error);
    process.exit(1);
});

process.on('exit', async () => {
    console.log('Closing subscriber...');
    await subscriber.close();
});

(async () => {
    try {
        await subscriber.connect();
        console.log('Listening for notifications on channel: menu_item_change...');
        await subscriber.listenTo('menu_item_change');
    } catch (err) {
        console.error('Error setting up subscriber:', err);
    }
})();
