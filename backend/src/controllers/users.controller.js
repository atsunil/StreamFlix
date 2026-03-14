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
const Notification = require('../models/Notification');
const mongoose = require('mongoose');
const mockStorage = require('../utils/mockStorage');

async function getWatchlist(req, res, next) {
  try {
    const userId = req.user?.id || req.params.userId;
    if (!userId) return res.status(400).json({ message: 'Missing user id' });
    
    if (!process.env.DATABASE_URL && !process.env.MONGODB_URI) {
      const user = mockStorage.userStorage.getById(userId);
      if (!user) return res.status(404).json({ message: 'User not found' });
      const populated = (user.watchlist || []).map(id => mockStorage.movieStorage.getById(id)).filter(Boolean);
      return res.json(populated);
    }
    
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
    if (!userId || !movieId) {
      return res.status(400).json({ message: 'Missing params' });
    }
    
    if (!process.env.DATABASE_URL && !process.env.MONGODB_URI) {
      const user = mockStorage.userStorage.getById(userId);
      if (!user) return res.status(404).json({ message: 'User not found' });
      if (!user.watchlist) user.watchlist = [];
      if (!user.watchlist.includes(movieId)) {
        user.watchlist.push(movieId);
      }
      const populated = user.watchlist.map(id => mockStorage.movieStorage.getById(id)).filter(Boolean);
      return res.json(populated);
    }
    
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    if (!user.watchlist) user.watchlist = [];
    
    // Ensure uniqueness manually without populate
    const stringWatchlist = user.watchlist.map(id => id.toString());
    if (!stringWatchlist.includes(movieId.toString())) {
      user.watchlist.push(movieId);
      await user.save();
    }
    
    await user.populate('watchlist');
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
    if (!userId || !movieId) {
      return res.status(400).json({ message: 'Missing params' });
    }
    
    if (!process.env.DATABASE_URL && !process.env.MONGODB_URI) {
      const user = mockStorage.userStorage.getById(userId);
      if (!user) return res.status(404).json({ message: 'User not found' });
      if (!user.watchlist) user.watchlist = [];
      user.watchlist = user.watchlist.filter(id => id !== movieId);
      const populated = user.watchlist.map(id => mockStorage.movieStorage.getById(id)).filter(Boolean);
      return res.json(populated);
    }
    
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    if (!user.watchlist) user.watchlist = [];
    
    // Remove all instances of movieId from watchlist
    user.watchlist = user.watchlist.filter(id => id.toString() !== movieId.toString());
    
    await user.save();
    await user.populate('watchlist');
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

async function getNotifications(req, res, next) {
  try {
    const userId = req.user?.id;
    if (!userId) return res.status(401).json({ message: 'Unauthorized' });
    const notifications = await Notification.find({ userId })
      .sort({ createdAt: -1 })
      .populate('movieId', 'slug title posterUrl');
    res.json(notifications);
  } catch (err) {
    next(err);
  }
}

async function markNotificationsRead(req, res, next) {
  try {
    const userId = req.user?.id;
    if (!userId) return res.status(401).json({ message: 'Unauthorized' });
    await Notification.updateMany({ userId, isRead: false }, { isRead: true });
    res.json({ message: 'Notifications marked as read' });
  } catch (err) {
    next(err);
  }
}

module.exports = {
  getWatchlist,
  addToWatchlist,
  removeFromWatchlist,
  updateRecentlyWatched,
  getRecommendations,
  getMe,
  getNotifications,
  markNotificationsRead
};