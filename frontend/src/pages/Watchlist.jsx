import React, { useEffect, useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { fetchWatchlist } from '../api/api';
import MovieCard from '../components/MovieCard';

const Watchlist = () => {
  const authContext = useContext(AuthContext);
  const user = authContext?.user;
  const [watchlist, setWatchlist] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let intervalId;
    const getWatchlist = async () => {
      try {
        if (user?.token) {
          const data = await fetchWatchlist(user.token);
          setWatchlist(data);
        }
      } catch (err) {
        console.error('Failed to fetch watchlist:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      getWatchlist();
      intervalId = setInterval(getWatchlist, 2000); // Poll every 2 seconds
    } else {
      setLoading(false);
    }
    return () => intervalId && clearInterval(intervalId);
  }, [user]);

  if (!user) {
    return (
      <div style={{ padding: '2rem', textAlign: 'center', minHeight: '60vh' }}>
        <p style={{ color: '#999' }}>Please log in to view your watchlist</p>
      </div>
    );
  }

  if (loading) {
    return <div style={{ padding: '2rem', textAlign: 'center' }}>Loading watchlist...</div>;
  }

  if (error) {
    return <div style={{ padding: '2rem', textAlign: 'center', color: '#ff6b6b' }}>Error: {error}</div>;
  }

  return (
    <div className="home">
      <div className="section">
        <h1>My Watchlist</h1>
        {watchlist.length === 0 ? (
          <div className="no-movies">
            <p>No movies in your watchlist yet</p>
          </div>
        ) : (
          <div className="movie-list">
            {watchlist.map(movie => (
              <MovieCard key={movie._id} movie={movie} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Watchlist;