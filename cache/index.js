import navigationSubscriberInit from './navigation/index.js';

(async () => {
    try {
        await navigationSubscriberInit();
        console.log('Subscriber initialized.');
    } catch (err) {
        console.error('Error in root initialization:', err);
    }
})();

// process.on('exit', async () => {
//     console.log('Closing subscriber...');
//     await subscriber.close();
// });