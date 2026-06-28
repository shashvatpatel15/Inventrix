const express = require('express');
const cors = require('cors');
const apiRouter = require('./routes/apiRouter');
const errorHandler = require('./middlewares/errorHandler');

const app = express();

const corsOptions = {
  origin: process.env.CLIENT_URL || '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
};

app.use(cors(corsOptions));
app.use(express.json());

// Root route for health checks
app.get('/', (req, res) => {
    res.status(200).json({ status: 'OK', message: 'Inventrix Backend API is running' });
});

// API Routes
app.use('/api', apiRouter);

// Fallback 404 handler
app.use((req, res, next) => {
    res.status(404).json({ message: `API Route not found: ${req.method} ${req.originalUrl}` });
});

// Global Error Handler
app.use(errorHandler);

module.exports = app;
