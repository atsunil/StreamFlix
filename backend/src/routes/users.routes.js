const express = require('express');
const router = express.Router();
const { authMiddleware } = require('../middleware/auth.middleware'); // adjust path if needed
const {
  getWatchlist,
  addToWatchlist,
  removeFromWatchlist,
  updateRecentlyWatched,
  getRecommendations,
  getMe
} = require('../controllers/users.controller');

// Get current user info
router.get('/me', authMiddleware, getMe);

console.log('users.routes imports:', { authMiddlewareExists: !!authMiddleware, getWatchlist: !!getWatchlist });



router.get('/watchlist', authMiddleware, getWatchlist);
router.post('/watchlist', authMiddleware, addToWatchlist);
router.delete('/watchlist/:movieId', authMiddleware, removeFromWatchlist);

// Recently watched and recommendations
router.post('/recently-watched', authMiddleware, updateRecentlyWatched);
router.get('/recommendations', authMiddleware, getRecommendations);

// User profile management
// Profile management endpoints removed

module.exports = router;