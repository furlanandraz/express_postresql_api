export default function getClientMiddleware(req, res, next) {
    req.locals.clientType = req.headers['x-client-type'] || 'readonly';
    next();
};