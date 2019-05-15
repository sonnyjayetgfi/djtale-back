const bcrypt = require('bcrypt-nodejs');

const Encryption = {};

Encryption.encryptPassword = function (password) {
  return new Promise(((resolve, reject) => {
    if (password == null){
      resolve(false);
    }
    bcrypt.hash(password, bcrypt.genSaltSync(8), null, (err, hash) => {
      if (err) {
        reject(err);
      } else {
        resolve(hash);
      }
    });
  }));
};

Encryption.comparePasswords = function (password, hash) {
  return new Promise(((resolve, reject) => {
    bcrypt.compare(password, hash, (err, ret) => {
      if (err) {
        reject(err);
      } else {
        resolve(ret);
      }
    });
  }));
};

module.exports = Encryption;
