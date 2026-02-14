// Get current user info
async function getMe(req, res, next) {
  try {
    const userId = req.user?.id;
    if (!userId) return res.status(401).json({ message: 'Unauthorized' });
    const user = await User.findById(userId)
      .select('-passwordHash')
      .populate('recentlyWatched.movie');
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json(user);
  } catch (err) {
    next(err);
  }
}
const User = require('../models/User');
const Movie = require('../models/Movie');
const mongoose = require('mongoose');

async function getWatchlist(req, res, next) {
  try {
    const userId = req.user?.id || req.params.userId;
    if (!userId) return res.status(400).json({ message: 'Missing user id' });
    const user = await User.findById(userId).populate('watchlist');
    if (!user) return res.status(404).json({ message: 'User not found' });
    return res.json(user.watchlist || []);
  } catch (err) {
    next(err);
  }
}

async function addToWatchlist(req, res, next) {
  try {
    const userId = req.user?.id;
    const { movieId } = req.body;
    console.log('[addToWatchlist] userId:', userId, 'movieId:', movieId);
    if (!userId || !movieId) {
      console.log('[addToWatchlist] Missing params', { userId, movieId });
      return res.status(400).json({ message: 'Missing params' });
    }
    const user = await User.findById(userId).populate('watchlist');
    if (!user) {
      console.log('[addToWatchlist] User not found:', userId);
      return res.status(404).json({ message: 'User not found' });
    }
    if (!user.watchlist) user.watchlist = [];
    // Remove any existing instances of movieId to prevent duplicates
    user.watchlist = user.watchlist.filter(id => {
      if (typeof id === 'object' && id._id) {
        return id._id.toString() !== movieId;
      }
      return id.toString() !== movieId;
    });
    user.watchlist.push(movieId);
    console.log('[addToWatchlist] Movie added to watchlist (no duplicates):', movieId);
    await user.save();
    await user.populate('watchlist');
    console.log('[addToWatchlist] Updated watchlist:', user.watchlist.map(m => m._id?.toString() || m.toString()));
    return res.json(user.watchlist);
  } catch (err) {
    console.error('[addToWatchlist] Error:', err);
    next(err);
  }
}

async function removeFromWatchlist(req, res, next) {
  try {
    const userId = req.user?.id;
    const { movieId } = req.params;
    console.log('[removeFromWatchlist] userId:', userId, 'movieId:', movieId);
    if (!userId || !movieId) {
      console.log('[removeFromWatchlist] Missing params', { userId, movieId });
      return res.status(400).json({ message: 'Missing params' });
    }
    const user = await User.findById(userId).populate('watchlist');
    if (!user) {
      console.log('[removeFromWatchlist] User not found:', userId);
      return res.status(404).json({ message: 'User not found' });
    }
    if (!user.watchlist) user.watchlist = [];
    const before = user.watchlist.length;
    // Remove all instances of movieId from watchlist
    user.watchlist = user.watchlist.filter(id => {
      if (typeof id === 'object' && id._id) {
        return id._id.toString() !== movieId;
      }
      return id.toString() !== movieId;
    });
    const after = user.watchlist.length;
    console.log(`[removeFromWatchlist] Watchlist size before: ${before}, after: ${after}`);
    await user.save();
    await user.populate('watchlist');
    console.log('[removeFromWatchlist] Updated watchlist:', user.watchlist.map(m => m._id?.toString() || m.toString()));
    return res.json(user.watchlist);
  } catch (err) {
    console.error('[removeFromWatchlist] Error:', err);
    next(err);
  }
}


// Add a movie to recently watched (or update position/timestamp) for active profile
async function updateRecentlyWatched(req, res, next) {
  try {
    const userId = req.user?.id;
    const { movieId, position = 0 } = req.body;
    if (!userId || !movieId) return res.status(400).json({ message: 'Missing params' });
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: 'User not found' });
    // Remove if already exists
    user.recentlyWatched = user.recentlyWatched.filter(e => e.movie.toString() !== movieId);
    // Add to front
    user.recentlyWatched.unshift({ movie: movieId, watchedAt: new Date(), position });
    // Limit to last 20
    if (user.recentlyWatched.length > 20) {
      user.recentlyWatched = user.recentlyWatched.slice(0, 20);
    }
    await user.save();
    await user.populate('recentlyWatched.movie');
    return res.json(user.recentlyWatched);
  } catch (err) {
    next(err);
  }
}

// Get recommendations based on genres of recently watched movies for active profile
async function getRecommendations(req, res, next) {
  try {
    const userId = req.user?.id;
    if (!userId) return res.status(400).json({ message: 'Missing user id' });
    const user = await User.findById(userId).populate('recentlyWatched.movie');
    if (!user) return res.status(404).json({ message: 'User not found' });
    // Collect genres from recently watched
    const genreCounts = {};
    user.recentlyWatched.forEach(entry => {
      const genres = entry.movie?.genres || [];
      genres.forEach(g => {
        genreCounts[g] = (genreCounts[g] || 0) + 1;
      });
    });
    const topGenres = Object.entries(genreCounts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 3)
      .map(([g]) => g);
    // Recommend movies in those genres, not already watched
    const watchedIds = user.recentlyWatched.map(e => e.movie?._id?.toString());
    const recs = await Movie.find({
      genres: { $in: topGenres },
      _id: { $nin: watchedIds },
      isPublished: true
    }).limit(12);
    return res.json(recs);
  } catch (err) {
    next(err);
  }
}


// Profile management logic removed

module.exports = {
  getWatchlist,
  addToWatchlist,
  removeFromWatchlist,
  updateRecentlyWatched,
  getRecommendations
  ,getMe
};