const express = require('express');
const connectDB = require('./config/db');

// Initialize Express app
const app = express();

// Connect Database
connectDB();

// Init Middleware
app.use(express.json({ extended: false }));

// Define Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/posts', require('./routes/posts'));
app.use('/api/users', require('./routes/users'));

// Export the app for use in server.js
module.exports = app;
