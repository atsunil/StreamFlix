import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import MovieForm from '../../components/MovieForm';
import { getMovies, deleteMovie } from '../../api/api';

const MovieManager = () => {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        const response = await getMovies();
        setMovies(response.data);
      } catch (error) {
        console.error('Error fetching movies:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchMovies();
  }, []);

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this movie?')) {
      try {
        await deleteMovie(id);
        setMovies(movies.filter(movie => movie._id !== id));
      } catch (error) {
        console.error('Error deleting movie:', error);
      }
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h1>Movie Manager</h1>
      <MovieForm />
      <h2>Existing Movies</h2>
      <ul>
        {movies.map(movie => (
          <li key={movie._id}>
            {movie.title}
            <button onClick={() => navigate(`/admin/movies/edit/${movie._id}`)}>Edit</button>
            <button onClick={() => handleDelete(movie._id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default MovieManager;