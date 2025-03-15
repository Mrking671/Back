const mongoose = require('mongoose');

const movieSchema = new mongoose.Schema({
  file_id: String,
  file_name: String,
  file_size: Number,
  caption: String,
  tmdbData: Object,
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Movie', movieSchema, 'vjcollection');
