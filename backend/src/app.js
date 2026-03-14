const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const path = require('path');
const authRoutes = require('./routes/auth.routes');
const moviesRoutes = require('./routes/movies.routes');
const usersRoutes = require('./routes/users.routes');
const adminRoutes = require('./routes/admin.routes');
const uploadRoutes = require('./routes/upload.routes');

const app = express();

// Middleware
app.use(cors());
// helmet crossOriginResourcePolicy needs to be configured to allow images to be loaded from localhost
app.use(helmet({ crossOriginResourcePolicy: false }));
app.use(express.json());

// Serve static files from public directory
app.use('/public', express.static(path.join(__dirname, '../public')));

// Health check
app.get('/', (req, res) => {
  res.json({ message: 'StreamFlix API is running', version: '1.0.0' });
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/movies', moviesRoutes);
app.use('/api/users', usersRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/upload', uploadRoutes);

module.exports = app;