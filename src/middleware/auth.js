const jwt = require('jsonwebtoken');
const config  = require('config');

module.exports = function auth(req,res,next){
    const authcookie = req.cookies.secure ;
    
    if(!authcookie) 
        return res.status(401).send('Acess denied . No token provided');
    
    jwt.verify(authcookie, config.get('jwtPrivateKey'));
    next();
}