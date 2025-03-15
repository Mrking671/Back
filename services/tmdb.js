const axios = require('axios');

const getTMDBInfo = async (title) => {
  try {
    const response = await axios.get(
      `https://api.themoviedb.org/3/search/multi?api_key=${process.env.TMDB_API_KEY}&query=${encodeURIComponent(title)}`
    );
    return response.data.results[0];
  } catch (error) {
    console.error('TMDB API error:', error);
    return null;
  }
};

module.exports = { getTMDBInfo };
