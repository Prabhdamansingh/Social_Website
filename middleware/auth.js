const jwt = require('jsonwebtoken');
const config = require('config');

module.exports = function (req, res, next) {
    // its a middleware function that has ascces to req and res object next is object which just telss to move to another

    //1. get from header
    const token = req.header('x-auth-token');

    //2. check the tocken if its not empty
    if (!token) {
        return res
            .status(401)
            .json({ msg: ' No token , Authorization denied' });
    }

    //3. verify token

    try {
        const decode = jwt.verify(token, config.get('jwtToken')); //info -it takes actual token which came and the token secret and verify and decode it

        // info = here we are actually taking out user out of token and this user will be used in mongoose to take out details and then we can manage state of redux  , to be like yes this is the same person everytime
        req.user = decode.user;
        next();
    } catch (err) {
        // if token is not valid
        res.status(401).json({ msg: 'Token is  not valid' });
    }
};