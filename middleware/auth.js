const jwt = require('jsonwebtoken');
const config = require('config');
module.exports = function (req, res, next){
    const token = req.header('x-auth-token');
    if (!token) return res.status(401).send('Access Denied. No Token Provided.');
    try {
        const decodedPayload = jwt.verify(token, config.get('jwtPrivateKey'));
        req.user = decodedPayload;
        next();
    }
    catch(ex){
        //console.log('EXCEPTION CAME HERE=', ex);
        res.status(400).json(new Error('Invalid Token.'));
    }
}