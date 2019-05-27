const User = require('../Models/User');
const encryption = require('../../Services/encryption');
const jsonwebtoken = require('../../Services/jsonwebtoken');
module.exports = {
    getUserByCriterias : function(criterias) {
        return new Promise((resolve, reject) => {
            User.findOne(criterias, (err, user) => {
                if (err) {
                    reject(err);
                }
                resolve(user);
            })
        })
    }
};
