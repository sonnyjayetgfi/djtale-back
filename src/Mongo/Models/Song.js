const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const SongSchema = new mongoose.Schema({
  name: String,
  url: String,
  priority: Number,
  playlistId: [{ type: Schema.Types.ObjectId, ref: 'Playlist' }]
});

module.exports = mongoose.model('Song', SongSchema);