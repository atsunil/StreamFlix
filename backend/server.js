require('dotenv').config(); // MUST be first

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');

const app = express();

// Middleware
app.use(cors());
app.use(helmet());
app.use(express.json());

// Import routes
const authRoutes = require('./src/routes/auth.routes');
const moviesRoutes = require('./src/routes/movies.routes');
const usersRoutes = require('./src/routes/users.routes');
const adminRoutes = require('./src/routes/admin.routes');

// Health check
app.get('/', (req, res) => {
  res.json({ message: 'StreamFlix API is running', version: '1.0.0' });
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/movies', moviesRoutes);
app.use('/api/users', usersRoutes);
app.use('/api/admin', adminRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('❌ Error:', err);
  
  // Mongoose validation error
  if (err.name === 'ValidationError') {
    return res.status(400).json({ 
      error: 'Validation error',
      details: Object.values(err.errors).map(e => e.message)
    });
  }
  
  // Mongoose cast error
  if (err.name === 'CastError') {
    return res.status(400).json({ 
      error: 'Invalid ID format'
    });
  }
  
  // Default error
  res.status(err.status || 500).json({ 
    error: err.message || 'Internal server error'
  });
});

// Database connection
const PORT = process.env.PORT || 5000;
const DATABASE_URL = process.env.DATABASE_URL || process.env.MONGODB_URI;

console.log('🔧 Configuration:');
console.log('  PORT:', PORT);
console.log('  DATABASE_URL:', DATABASE_URL);

if (!DATABASE_URL) {
  console.error('ERROR: DATABASE_URL not set in .env');
  process.exit(1);
}

// Global error handlers
process.on('unhandledRejection', (reason, promise) => {
  console.error('❌ Unhandled Rejection at:', promise, 'reason:', reason);
});

process.on('uncaughtException', (error) => {
  console.error('❌ Uncaught Exception:', error);
  process.exit(1);
});

mongoose.connect(DATABASE_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => {
  console.log('✅ Connected to MongoDB');
  const server = app.listen(PORT, '0.0.0.0', () => {
    console.log(`✅ Server is running on http://localhost:${PORT}`);
    console.log(`✅ API Base URL: http://localhost:${PORT}/api`);
    
    // Keep process alive with periodic log
    setInterval(() => {
      // Silent check to keep process alive
    }, 30000);
  });
  
  server.on('error', (err) => {
    console.error('❌ Server error:', err);
    process.exit(1);
  });
})
.catch(err => {
  console.error('❌ MongoDB connection error:', err);
  process.exit(1);
});

// Keep process alive