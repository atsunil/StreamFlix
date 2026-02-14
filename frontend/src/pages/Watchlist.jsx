import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import MovieCard from '../components/MovieCard';
import MovieDetailsModal from '../components/MovieDetailsModal';
import Skeleton from '../components/Skeleton';
import { useToast } from '../context/ToastContext';
import './Watchlist.css';

const SORT_OPTIONS = [
  { value: 'recent', label: 'Recently Added' },
  { value: 'alpha', label: 'Alphabetical' },
  { value: 'genre', label: 'Genre' },
];

const Watchlist = () => {
  const navigate = useNavigate();
  const [watchlist, setWatchlist] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [sortBy, setSortBy] = useState('recent');
  const { user } = useContext(AuthContext);
  const { showToast } = useToast();

  useEffect(() => {
    const fetchWatchlist = async () => {
      // In a real app this would fetch the user's actual watchlist
      // For now, allow viewing in demo mode or fetch mock data
      if (!user?.token) {
        // Fallback or demo data if not logged in, or redirect
        // For this demo, let's just fetch movies as a "mock" watchlist
      }

      try {
        const res = await fetch('http://localhost:5000/api/movies');
        const data = await res.json();
        // Demo: treat first 3 as watchlist items so user sees something
        setWatchlist(data.slice(0, 3).map((m, i) => ({
          ...m,
          addedAt: Date.now() - i * 86400000,
          progress: i === 0 ? 65 : i === 1 ? 30 : 0,
        })));
      } catch (e) {
        console.error(e);
      } finally {
        setTimeout(() => setLoading(false), 800);
      }
    };
    fetchWatchlist();
  }, [user]);

  const handleRemove = (movie) => {
    setWatchlist(prev => prev.filter(m => m._id !== movie._id));
    showToast(`Removed "${movie.title}" from watchlist`, 'info');
  };

  const handlePlay = (movie) => {
    navigate(`/watch/${movie.slug}`);
  };

  const handleClearAll = () => {
    if (window.confirm('Are you sure you want to clear your entire watchlist?')) {
      setWatchlist([]);
      showToast('Watchlist cleared', 'info');
    }
  };

  const getSorted = () => {
    const arr = [...watchlist];
    if (sortBy === 'alpha') arr.sort((a, b) => (a.title || '').localeCompare(b.title || ''));
    else if (sortBy === 'genre') arr.sort((a, b) => (a.genres?.[0] || '').localeCompare(b.genres?.[0] || ''));
    else arr.sort((a, b) => (b.addedAt || 0) - (a.addedAt || 0));
    return arr;
  };

  if (loading) return (
    <div className="watchlist-page fade-in">
      <div className="wl-header">
        <Skeleton width="250px" height="40px" />
      </div>
      <div className="watchlist-grid">
        {[...Array(4)].map((_, i) => <Skeleton key={i} width="100%" height="360px" />)}
      </div>
    </div>
  );

  const sortedList = getSorted();

  return (
    <div className="watchlist-page fade-in">
      {selectedMovie && (
        <MovieDetailsModal
          movie={selectedMovie}
          onClose={() => setSelectedMovie(null)}
          onAddToWatchlist={() => { }}
          onPlay={handlePlay}
        />
      )}

      <div className="wl-header">
        <div className="wl-title-row">
          <h1>My Watchlist</h1>
          <div className="wl-title-right">
            <span className="count-badge">{watchlist.length} {watchlist.length === 1 ? 'Movie' : 'Movies'}</span>
            {watchlist.length > 0 && (
              <button className="clear-all-btn" onClick={handleClearAll}>Clear All</button>
            )}
          </div>
        </div>
        {watchlist.length > 0 && (
          <div className="wl-sort">
            {SORT_OPTIONS.map(opt => (
              <button
                key={opt.value}
                className={`sort-btn ${sortBy === opt.value ? 'active' : ''}`}
                onClick={() => setSortBy(opt.value)}
              >
                {opt.label}
              </button>
            ))}
          </div>
        )}
      </div>

      {sortedList.length === 0 ? (
        <div className="empty-state glass-card">
          <span className="empty-illustration">🎬</span>
          <h2>Your watchlist is empty</h2>
          <p>Discover great movies and add them to your personal collection!</p>
          <Link to="/" className="btn primary-btn">Browse Movies</Link>
        </div>
      ) : (
        <div className="watchlist-grid">
          {sortedList.map(movie => (
            <div key={movie._id} className="watchlist-item-container">
              <MovieCard
                movie={movie}
                onShowDetails={setSelectedMovie}
              />
              <div className="wl-item-actions">
                <button className="wl-action-btn play" onClick={() => handlePlay(movie)}>▶ Play</button>
                <button className="wl-action-btn details" onClick={() => setSelectedMovie(movie)}>ℹ Details</button>
                <button className="wl-action-btn remove" onClick={() => handleRemove(movie)}>✕ Remove</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Watchlist;