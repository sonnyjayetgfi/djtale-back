const AuthService = require('../Mongo/Services/AuthServices');
const express = require('express');
const router = express.Router();

router.post('/register', (req, res) => {
  if (!req.body.email || !req.body.password || !req.body.pseudo) {
    return res.status(400).json({
      statusCode: 400,
      codeMessage: 'RegisterInvalidForm',
    });
  }
  const form = {
    email: req.body.email,
    password: req.body.password,
    pseudo: req.body.pseudo
  }
  AuthService.isEmailUsed(form.email)
    .then((response) => {
      if (response) {
        return res.status(400).json({
          statusCode: 400,
          codeMessage: 'RegisterEmailAlreadyUsed'
        })
      }
      AuthService.register(form)
        .then(() => {
          res.status(200).json({
            statusCode: 200,
            codeMessage: 'RegisterSuccess',
          })
        })
        .catch((error) => {
          res.status(500).send({
            statusCode: 500,
            codeMessage: 'RegisterInternalError',
            error,
          })
        })
    })
    .catch((error) => {
      return res.status(500).json({
        statusCode: 500,
        codeMessage: 'RegisterInternalError',
        error,
      });
    });
});

router.post('/login', (req, res) => {
  if (!req.body.email || !req.body.password) {
    return res.status(400).json({
      codeMessage: 'LoginInvalidForm',
      statusCode: 400,
    });
  }
  const form = {
    email: req.body.email,
    password: req.body.password
  };
  AuthService.login(form)
    .then((user) => {
      res.status(200).json({
        codeMessage: 'LoginSuccess',
        statusCode: 200,
        data: user,
      });
    })
    .catch((error) => {
      res.status(400).json({
        codeMessage: 'LoginInvalidCredentials',
        statusCode: 400,
        error
      });
    });
});

module.exports = router;