const mongoose = require('mongoose');
const SongSchema = require('./Song');
const Schema = mongoose.Schema;

const playlistSchema = new mongoose.Schema({
  userId: String,
  name: String,
  playlistByDefault: Boolean,
  songs : [{type: Schema.Types.ObjectId, ref:'Song'}],
});

module.exports = mongoose.model('Playlist', playlistSchema);