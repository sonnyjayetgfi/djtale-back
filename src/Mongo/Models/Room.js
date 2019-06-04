const mongoose = require('mongoose');
const SongSchema = require('./Song');
const Schema = mongoose.Schema;

const RoomSchema = new mongoose.Schema({
  creatorName : String, 
  name: String,
  description: String,
  playlist : {type: Schema.Types.ObjectId, ref: 'Playlist'},
  people: Number  
});

module.exports = mongoose.model('Room', RoomSchema);