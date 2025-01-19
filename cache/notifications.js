export function pg_notify(channel, payload) {
    // usage: SELECT pg_notify('menu_item_change', '{"payload": "update successful"}');
    return `SELECT pg_notify(${channel}, ${payload});`
}