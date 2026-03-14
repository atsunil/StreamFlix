const Movie = require('../models/Movie');
const User = require('../models/User');
const Notification = require('../models/Notification');
const mockStorage = require('../utils/mockStorage');

async function createMovie(req, res, next) {
  try {
    if (!process.env.DATABASE_URL && !process.env.MONGODB_URI) {
      console.log('📝 Mock: Creating movie:', req.body.title);
      const movie = mockStorage.movieStorage.create(req.body);
      return res.status(201).json(movie);
    }

    console.log('Creating movie with data:', req.body);
    const movie = await Movie.create(req.body);
    
    // Create notifications for all users
    try {
      const users = await User.find({}, '_id');
      const notifications = users.map(u => ({
        userId: u._id,
        message: `New arrival: ${movie.title} is now available!`,
        movieId: movie._id
      }));
      if (notifications.length > 0) {
        await Notification.insertMany(notifications);
      }
    } catch (notifErr) {
      console.error('Error creating notifications:', notifErr);
    }
    
    res.status(201).json(movie);
  } catch (err) {
    console.error('Create movie error:', err);
    next(err);
  }
}

async function updateMovie(req, res, next) {
  try {
    if (!process.env.DATABASE_URL && !process.env.MONGODB_URI) {
      console.log('📝 Mock: Updating movie:', req.params.id);
      const movie = mockStorage.movieStorage.update(req.params.id, req.body);
      if (!movie) return res.status(404).json({ error: 'Movie not found' });
      return res.json(movie);
    }

    const updateData = { ...req.body };
    delete updateData._id;

    const movie = await Movie.findByIdAndUpdate(req.params.id, updateData, {
      new: true,
      runValidators: true
    });

    if (!movie) {
      return res.status(404).json({ error: 'Movie not found' });
    }

    res.json(movie);
  } catch (err) {
    console.error('Update movie error:', err);
    next(err);
  }
}

async function deleteMovie(req, res, next) {
  try {
    if (!process.env.DATABASE_URL && !process.env.MONGODB_URI) {
      console.log('📝 Mock: Deleting movie:', req.params.id);
      const success = mockStorage.movieStorage.delete(req.params.id);
      if (!success) return res.status(404).json({ error: 'Movie not found' });
      return res.status(204).end();
    }

    const movie = await Movie.findByIdAndDelete(req.params.id);
    if (!movie) {
      return res.status(404).json({ error: 'Movie not found' });
    }
    res.status(204).end();
  } catch (err) {
    console.error('Delete movie error:', err);
    next(err);
  }
}

async function getAllMovies(req, res, next) {
  try {
    if (!process.env.DATABASE_URL && !process.env.MONGODB_URI) {
      return res.json(mockStorage.movieStorage.getAll());
    }

    const movies = await Movie.find();
    res.json(movies);
  } catch (err) {
    console.error('Get all movies error:', err);
    next(err);
  }
}

module.exports = { createMovie, updateMovie, deleteMovie, getAllMovies };