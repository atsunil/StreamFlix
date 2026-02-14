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

  const fetchMovies = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/movies');
      const data = await response.json();
      setMovies(data);
    } catch (err) {
      console.error('Error fetching movies:', err);
    }
  };

  useEffect(() => {
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
    if (!window.confirm('Delete this masterpiece?')) return;

    try {
      await fetch(`http://localhost:5000/api/admin/movies/${movieId}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${user.token}` },
      });
      setMovies(movies.filter(m => m._id !== movieId));
    } catch (err) {
      console.error('Error deleting movie:', err);
    }
  };

  const handleFormSubmit = () => {
    setShowForm(false);
    fetchMovies();
  };

  if (loading) return <div className="loading">Initializing Dashboard...</div>;

  return (
    <div className="admin-container fade-in">
      <div className="dashboard-header">
        <div className="header-titles">
          <h1>Studio Control</h1>
          <p>Manage your cinematic library</p>
        </div>
        <button className="btn-add glass-card" onClick={handleAddMovie}>
          <span className="plus-icon">＋</span> Add New Entry
        </button>
      </div>

      <div className="dashboard-stats grid-3">
        <div className="stat-card glass-card">
          <h3>Total Movies</h3>
          <p>{movies.length}</p>
        </div>
        <div className="stat-card glass-card">
          <h3>Public Entries</h3>
          <p>{movies.filter(m => m.isPublished).length}</p>
        </div>
        <div className="stat-card glass-card">
          <h3>Drafts</h3>
          <p>{movies.filter(m => !m.isPublished).length}</p>
        </div>
      </div>

      {showForm && (
        <div className="wizard-modal-overlay" onClick={() => setShowForm(false)}>
          <div className="wizard-modal-content glass-card" onClick={e => e.stopPropagation()}>
            <button className="close-wizard" onClick={() => setShowForm(false)}>✕</button>
            <MovieForm
              initialData={formData}
              onSubmit={handleFormSubmit}
              userToken={user.token}
            />
          </div>
        </div>
      )}

      <div className="movies-glass-list glass-card">
        <table className="modern-table">
          <thead>
            <tr>
              <th>Title</th>
              <th>Genres</th>
              <th>Release</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {movies.map(movie => (
              <tr key={movie._id} className="table-row">
                <td className="movie-title-cell">
                  <img src={movie.posterUrl} alt="" className="mini-poster" />
                  <strong>{movie.title}</strong>
                </td>
                <td><span className="genre-pill">{movie.genres?.join(', ')}</span></td>
                <td>{new Date(movie.releaseDate).getFullYear()}</td>
                <td>
                  <span className={`status-dot ${movie.isPublished ? 'published' : 'draft'}`}>
                    {movie.isPublished ? 'Live' : 'Draft'}
                  </span>
                </td>
                <td className="actions-cell">
                  <button className="action-btn edit" onClick={() => handleEditMovie(movie)}>✎</button>
                  <button className="action-btn delete" onClick={() => handleDeleteMovie(movie._id)}>🗑</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Dashboard;