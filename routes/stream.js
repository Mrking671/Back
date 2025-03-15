const express = require('express');
const router = express.Router();
const axios = require('axios');
const Movie = require('../models/Movie');

router.get('/:fileId', async (req, res) => {
  try {
    const fileId = req.params.fileId;
    const movie = await Movie.findOne({ file_id: fileId });
    if (!movie) return res.status(404).send('File not found');

    const tgResponse = await axios.get(
      `https://api.telegram.org/bot${process.env.TELEGRAM_BOT_TOKEN}/getFile?file_id=${fileId}`
    );

    const filePath = tgResponse.data.result.file_path;
    const streamUrl = `https://api.telegram.org/file/bot${process.env.TELEGRAM_BOT_TOKEN}/${filePath}`;

    const range = req.headers.range;
    if (range) {
      const { data, headers } = await axios({
        method: 'get',
        url: streamUrl,
        headers: { Range: range },
        responseType: 'stream',
      });

      res.writeHead(206, headers);
      data.pipe(res);
    } else {
      const response = await axios({
        method: 'get',
        url: streamUrl,
        responseType: 'stream',
      });

      res.setHeader('Content-Length', movie.file_size);
      res.setHeader('Content-Type', 'video/mp4');
      response.data.pipe(res);
    }
  } catch (error) {
    console.error('Stream error:', error);
    res.status(500).send('Error streaming file');
  }
});

module.exports = router;
