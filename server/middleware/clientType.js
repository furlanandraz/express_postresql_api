export default function getClientMiddleware(req, res, next) {
    req.clientType = req.headers['x-client-type'] || undefined;
    next();
};