const mongoose = require('mongoose');

// Check if model already exists to prevent OverwriteModelError
if (mongoose.models && mongoose.models.Movie) {
  module.exports = mongoose.models.Movie;
} else {
  const movieSchema = new mongoose.Schema({
    file_id: {
      type: String,
      required: true,
      index: true,
      unique: true
    },
    file_name: {
      type: String,
      required: true,
      text: true
    },
    file_size: {
      type: Number,
      required: true
    },
    caption: {
      type: String,
      text: true
    },
    createdAt: {
      type: Date,
      default: Date.now
    },
    tmdbData: {
      type: mongoose.Schema.Types.Mixed
    }
  }, {
    collection: 'vjcollection',
    strict: false,
    timestamps: false
  });

  // Add text index for search
  movieSchema.index({
    file_name: 'text',
    caption: 'text'
  }, {
    weights: {
      file_name: 5,
      caption: 1
    },
    name: 'text_search_index'
  });

  // Create model only if it doesn't exist
  const Movie = mongoose.model('Movie', movieSchema);
  module.exports = Movie;
}
