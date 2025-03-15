const mongoose = require('mongoose');

const movieSchema = new mongoose.Schema({
  file_id: {
    type: String,
    required: true,
    index: true
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
  }
}, { 
  collection: 'vjcollection',
  strict: false 
});

// Text index for search
movieSchema.index({
  file_name: 'text',
  caption: 'text'
}, {
  weights: {
    file_name: 5,
    caption: 1
  }
});

module.exports = mongoose.model('Movie', movieSchema);
