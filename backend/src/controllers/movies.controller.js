const Movie = require('../models/Movie');
const mockStorage = require('../utils/mockStorage');

async function getMovies(req, res, next) {
  try {
    if (!process.env.DATABASE_URL && !process.env.MONGODB_URI) {
      console.log('📝 Mock: Getting all movies');
      return res.json(mockStorage.movieStorage.getAll());
    }

    const movies = await Movie.find({}).limit(50);
    res.json(movies);
  } catch (err) {
    next(err);
  }
}

async function getMovieBySlug(req, res, next) {
  try {
    if (!process.env.DATABASE_URL && !process.env.MONGODB_URI) {
      console.log('📝 Mock: Getting movie by slug:', req.params.slug);
      const movie = mockStorage.movieStorage.getOne(req.params.slug);
      if (!movie) return res.status(404).json({ message: 'Not found' });
      return res.json(movie);
    }

    const movie = await Movie.findOne({ slug: req.params.slug });
    if (!movie) return res.status(404).json({ message: 'Not found' });
    res.json(movie);
  } catch (err) {
    next(err);
  }
}

async function createMovie(req, res, next) {
  try {
    if (!process.env.DATABASE_URL && !process.env.MONGODB_URI) {
      const movie = mockStorage.movieStorage.create(req.body);
      return res.status(201).json(movie);
    }

    const movie = await Movie.create(req.body);
    res.status(201).json(movie);
  } catch (err) {
    next(err);
  }
}

async function deleteMovie(req, res, next) {
  try {
    if (!process.env.DATABASE_URL && !process.env.MONGODB_URI) {
      mockStorage.movieStorage.delete(req.params.id);
      return res.status(204).end();
    }

    await Movie.findByIdAndDelete(req.params.id);
    res.status(204).end();
  } catch (err) {
    next(err);
  }
}

module.exports = {
  getMovies,
  getMovieBySlug,
  createMovie,
  deleteMovie
};