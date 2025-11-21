import React, { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import MovieForm from '../../components/MovieForm';
import './Dashboard.css';

const Dashboard = () => {
  const { user, loading } = useContext(AuthContext);
  const navigate = useNavigate();
  const [movies, setMovies] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState(null);

  useEffect(() => {
    if (!loading && (!user || user.role !== 'admin')) {
      navigate('/');
    }
  }, [user, loading, navigate]);

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/movies');
        const data = await response.json();
        setMovies(data);
      } catch (err) {
        console.error('Error fetching movies:', err);
      }
    };

    if (user?.role === 'admin') {
      fetchMovies();
    }
  }, [user]);

  const handleAddMovie = () => {
    setFormData(null);
    setShowForm(true);
  };

  const handleEditMovie = (movie) => {
    setFormData(movie);
    setShowForm(true);
  };

  const handleDeleteMovie = async (movieId) => {
    if (!window.confirm('Are you sure you want to delete this movie?')) {
      return;
    }

    try {
      const response = await fetch(`http://localhost:5000/api/admin/movies/${movieId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${user.token}`,
        },
      });

      if (response.ok) {
        setMovies(movies.filter(m => m._id !== movieId));
        alert('Movie deleted successfully');
      } else {
        alert('Failed to delete movie');
      }
    } catch (err) {
      console.error('Error deleting movie:', err);
      alert('Error deleting movie');
    }
  };

  const handleFormSubmit = (newMovie) => {
    setShowForm(false);
    // Refresh movies list
    const fetchMovies = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/movies');
        const data = await response.json();
        setMovies(data);
      } catch (err) {
        console.error('Error fetching movies:', err);
      }
    };
    fetchMovies();
  };

  if (loading) {
    return <div style={{ padding: '2rem', textAlign: 'center' }}>Loading...</div>;
  }

  if (!user || user.role !== 'admin') {
    return null;
  }

  return (
    <div className="admin-dashboard">
      <div className="dashboard-header">
        <h1>Admin Dashboard</h1>
        <button className="btn btn-primary" onClick={handleAddMovie}>
          ➕ Add New Movie
        </button>
      </div>

      {showForm && (
        <div className="modal-overlay" onClick={() => setShowForm(false)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h2>{formData ? 'Edit Movie' : 'Add New Movie'}</h2>
              <button className="close-btn" onClick={() => setShowForm(false)}>✕</button>
            </div>
            <MovieForm 
              initialData={formData} 
              onSubmit={handleFormSubmit}
              userToken={user.token}
            />
          </div>
        </div>
      )}

      <div className="movies-table-container">
        <table className="movies-table">
          <thead>
            <tr>
              <th>Title</th>
              <th>Slug</th>
              <th>Genre</th>
              <th>Release Date</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {movies.map(movie => (
              <tr key={movie._id}>
                <td>{movie.title}</td>
                <td>{movie.slug}</td>
                <td>{movie.genres?.join(', ')}</td>
                <td>{new Date(movie.releaseDate).toLocaleDateString()}</td>
                <td>
                  <span className={`status ${movie.isPublished ? 'published' : 'draft'}`}>
                    {movie.isPublished ? 'Published' : 'Draft'}
                  </span>
                </td>
                <td>
                  <button 
                    className="btn btn-sm btn-edit"
                    onClick={() => handleEditMovie(movie)}
                  >
                    ✎ Edit
                  </button>
                  <button 
                    className="btn btn-sm btn-delete"
                    onClick={() => handleDeleteMovie(movie._id)}
                  >
                    🗑️ Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {movies.length === 0 && (
          <div style={{ textAlign: 'center', padding: '2rem', color: '#999' }}>
            No movies found
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;