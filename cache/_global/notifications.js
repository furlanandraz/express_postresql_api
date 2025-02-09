export default function pg_notify(channel, payload) {
    // usage: SELECT pg_notify('channel', '{"payload": "update successful"}');
    channel = String(channel);
    payload = JSON.stringify(payload);
    return `SELECT pg_notify('${channel}', '${payload}');`
}