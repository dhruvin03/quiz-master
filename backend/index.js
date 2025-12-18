/*
* Create an Express server that does the following things:
* - Loads environment variables from a .env file.
* - Enables CORS
* - Parses JSON request bodies.
* - Connects to MongoDB using the connectDB function from config/db.js.
* - Sets up routes for /api/health that returns {status: 'OK'}.
* - Listens on a port defined in process.env.PORT or defaults to 8000.
* Also add HTTP request logging using morgan middleware.
* Use 'dev' format for morgan logging.
*/

require('dotenv').config();
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const connectDB = require('./config/db');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

// Connect to MongoDB
connectDB();

// Routes
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK' });
});

// Start server
const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});