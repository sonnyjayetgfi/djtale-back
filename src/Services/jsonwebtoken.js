let jwt = require('jsonwebtoken');
const secret = require('../configuration').jwt.key;

module.exports  = {
    createToken: (userId) => {
        return jwt.sign({ userId }, secret, {
            expiresIn: '24h'
        });
    }
}

