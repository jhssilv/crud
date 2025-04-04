// General
require('dotenv').config({ path: `${__dirname}/../.env` });
const express = require('express');

// Security Middleware
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');

// Request Parsing
const morgan = require('morgan');

// Database Initialization
const { pool } = require('./services/databaseConfig');

const app = express();

// =============================================
// 1. Security Middleware
// =============================================
app.use(helmet());
app.use(cors({
  origin: process.env.FRONTEND_URL,
  credentials: true
}));

// Rate limiting for API routes
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});
app.use('/api', limiter);

// =============================================
// 2. Request Parsing & Logging
// =============================================
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true }));

// HTTP request logging
if (process.env.NODE_ENV !== 'test') {
  app.use(morgan(process.env.NODE_ENV === 'development' ? 'dev' : 'combined'));
}

// =============================================
// 3. API Routes
// =============================================
// User authentication
// POST = User authentication
app.use('/api/auth', require('./routes/auth'));
// Users route 
// GET = Fetch all users, POST = Create a new user
// PUT = Edits an user, DELETE = Deletes an user
app.use('/api/users', require('./routes/users'));

// =============================================
// 4. Error Handling
// =============================================
// 404 handler
app.use((req, res, next) => {
  res.status(404).json({ 
    message: 'Route not found',
    path: req.originalUrl
  });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  const statusCode = err.statusCode || 500;
  res.status(statusCode).json({
    message: err.message || 'Internal server error',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
});

// =============================================
// 5. Server Initialization
// =============================================
const PORT = process.env.PORT || 5000;

const server = app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
  console.error('Unhandled Rejection:', err);
  server.close(() => process.exit(1));
});

module.exports = {app, pool};