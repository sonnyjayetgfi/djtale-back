const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  email: String,
  passwordHash: String,
  pseudo : String,
  creationDate: Date,
  statistics: Object,
  identity : String
});

module.exports = mongoose.model('User', UserSchema);