const express = require('express');
const router = express.Router();

const {
  createMovie,
  getMovies,
  getMovieBySlug,
  deleteMovie
} = require('../controllers/movies.controller');

// simple routes (adjust middleware as needed)
router.get('/', getMovies);
router.get('/:slug', getMovieBySlug);
router.post('/', createMovie);      // must be a function
router.delete('/:id', deleteMovie);

module.exports = router;