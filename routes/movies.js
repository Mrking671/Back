const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

const Movie = mongoose.model('Movie', 
  new mongoose.Schema({}, { strict: false }), 
  'vjcollection'
);

// Get all movies with pagination
router.get('/', async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 50;
    const skip = (page - 1) * limit;

    const movies = await Movie.find()
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean();

    res.json({
      status: 'success',
      count: movies.length,
      page,
      data: movies
    });
  } catch (error) {
    console.error('Movies error:', error);
    res.status(500).json({ 
      status: 'error',
      message: 'Failed to fetch movies' 
    });
  }
});

// Search movies
router.get('/search', async (req, res) => {
  try {
    const query = req.query.q;
    if (!query) {
      return res.status(400).json({ 
        status: 'error',
        message: 'Search query required' 
      });
    }

    const results = await Movie.find(
      { $text: { $search: query } },
      { score: { $meta: "textScore" } }
    )
    .sort({ score: { $meta: "textScore" } })
    .limit(20)
    .lean();

    res.json({
      status: 'success',
      count: results.length,
      data: results
    });
  } catch (error) {
    console.error('Search error:', error);
    res.status(500).json({ 
      status: 'error',
      message: 'Search failed' 
    });
  }
});

module.exports = router;
