const Movie = require('../models/Movie');

async function createMovie(req, res, next) {
  try {
    console.log('Creating movie with data:', req.body);
    const movie = await Movie.create(req.body);
    res.status(201).json(movie);
  } catch (err) { 
    console.error('Create movie error:', err);
    next(err); 
  }
}

async function updateMovie(req, res, next) {
  try {
    console.log('Updating movie:', req.params.id);
    const updateData = { ...req.body };
    
    // Remove _id from update data to prevent conflicts
    delete updateData._id;
    
    console.log('Update data:', updateData);
    
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
    console.log('Deleting movie:', req.params.id);
    
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
    const movies = await Movie.find();
    res.json(movies);
  } catch (err) { 
    console.error('Get all movies error:', err);
    next(err); 
  }
}

module.exports = { createMovie, updateMovie, deleteMovie, getAllMovies };