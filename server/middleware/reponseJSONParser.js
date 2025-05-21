export default function responseJSONParser() {
    return function (req, res, next) {

        const _json = res.json.bind(res);

        res.json = (body) => {
            
            if (Array.isArray(body)) {
                if (body.length === 0) return res.status(404).json({ error: 'No entry found'});
                if (body.length === 1  && typeof body[0] === 'object') return _json(body[0]);
            }
            
            return _json(body);
          };
      
          next();
    }
}