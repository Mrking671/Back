require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
const movieRoutes = require('./routes/movies');
const streamRoutes = require('./routes/stream');

const app = express();

connectDB();

app.use(cors());
app.use(express.json());

app.use('/api/movies', movieRoutes);
app.use('/api/stream', streamRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
