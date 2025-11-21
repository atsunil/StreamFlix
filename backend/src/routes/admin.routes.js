const express = require('express');
const router = express.Router();

const { authMiddleware, adminMiddleware } = require('../middleware/auth.middleware');
const { createMovie, updateMovie, deleteMovie, getAllMovies } = require('../controllers/admin.controller');

// debug line
console.log('admin.routes imports:', {
  authMiddleware: !!authMiddleware,
  adminMiddleware: !!adminMiddleware,
  createMovie: !!createMovie,
  updateMovie: !!updateMovie,
  deleteMovie: !!deleteMovie,
  getAllMovies: !!getAllMovies
});

// Admin routes for managing movies
router.post('/movies', authMiddleware, adminMiddleware, createMovie);
router.put('/movies/:id', authMiddleware, adminMiddleware, updateMovie);
router.delete('/movies/:id', authMiddleware, adminMiddleware, deleteMovie);
router.get('/movies', authMiddleware, adminMiddleware, getAllMovies);

module.exports = router;