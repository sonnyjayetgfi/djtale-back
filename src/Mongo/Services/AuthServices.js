const User = require('../Models/User');
const encryption = require('../../Services/encryption');

const AuthService = {};

AuthService.isEmailUsed = email => new Promise((resolve, reject) => {
  User.find({ email }, (err, user) => {
    if (err) {
      reject(err);
    }
    if (user.length > 0) {
      resolve(true)
    }
    resolve(false);
  })
})

AuthService.register = form => new Promise((resolve, reject) => {
  encryption.encryptPassword(form.password)
    .then((hash) => {
      User.create({
        email: form.email,
        pseudo: form.pseudo,
        passwordHash: hash
      }, (err, response) => {
        if (err) {
          reject(err);
        }
        resolve(response);
      })
    })
    .catch((err) => {
      reject(err);
    });
});

AuthService.login = form => new Promise((resolve, reject) => {
  User.findOne({ email: form.email }, (err, user) => {
    if (err) {
      reject(err);
    }
    if (!user) {
      reject('Not Found');
    } else {
      encryption.comparePasswords(form.password, user.passwordHash)
        .then((ret) => {
          if (!ret) {
            reject(false);
          }
          resolve({ user });
        })
        .catch((error) => {
          reject(error);
        });
    }
  })
});

module.exports = AuthService;