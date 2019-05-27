const express = require('express');
const router = express.Router();
const UserService = require('../Mongo/Services/UserService');

router.use('/getByCriterias', (req, res) => {
    UserService.getUserByCriterias({identity: req.user.identity})
    .then((user) => {
        res.status(200).json(user);
    })
    .catch((error) => {
        res.status(400).json(error);
    })
})

module.exports = router;
