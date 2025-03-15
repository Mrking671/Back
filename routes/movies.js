const express = require('express');
const router = express.Router();
const Movie = require('../models/Movie');
const { getTMDBInfo } = require('../services/tmdb');

router.get('/', async (req, res) => {
  try {
    const movies = await Movie.find().sort({ createdAt: -1 }).limit(50);
    const enhancedMovies = await Promise.all(movies.map(async (movie) => {
      if (!movie.tmdbData) {
        const title = extractTitle(movie.file_name);
        const tmdbData = await getTMDBInfo(title);
        movie.tmdbData = tmdbData;
        await movie.save();
      }
      return movie;
    }));
    
    res.json(enhancedMovies.filter(movie => movie.tmdbData));
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

router.get('/search', async (req, res) => {
  try {
    const query = req.query.q;
    const movies = await Movie.find({
      $text: { $search: query }
    }).limit(20);
    
    res.json(movies);
  } catch (error) {
    res.status(500).json({ error: 'Search failed' });
  }
});

function extractTitle(filename) {
  return filename
    .replace(/([._])/g, ' ')
    .replace(/[0-9]{3,4}p/g, '')
    .replace(/S\d+E\d+/gi, '')
    .replace(/[^a-zA-Z0-9 ]/g, '')
    .trim();
}

module.exports = router;
