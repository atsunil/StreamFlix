import React, { useEffect, useState, useContext } from 'react';
import { useParams } from 'react-router-dom';
import { fetchMovieDetails, addToWatchlist, removeFromWatchlist, updateRecentlyWatched, fetchWatchlist } from '../api/api';
import { AuthContext } from '../context/AuthContext';
import './MovieDetail.css';

const MovieDetail = () => {
  const { slug } = useParams();
  const { user } = useContext(AuthContext);
  const [movie, setMovie] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isInWatchlist, setIsInWatchlist] = useState(false);
  const [addingToWatchlist, setAddingToWatchlist] = useState(false);
  const [showVideo, setShowVideo] = useState(false);
  const [videoPosition, setVideoPosition] = useState(0);

  useEffect(() => {
    const getMovieDetailsAndWatchlist = async () => {
      try {
        const data = await fetchMovieDetails(slug);
        setMovie(data);
        if (user?.token && data?._id) {
          const watchlist = await fetchWatchlist(user.token);
          setIsInWatchlist(Array.isArray(watchlist) && watchlist.some(m => m._id === data._id));
        } else {
          setIsInWatchlist(false);
        }
      } catch (err) {
        console.error('Error fetching movie details:', err);
        setError('Error fetching movie details');
      } finally {
        setLoading(false);
      }
    };
    getMovieDetailsAndWatchlist();
    // eslint-disable-next-line
  }, [slug, user]);

  const handleAddToWatchlist = async () => {
    if (!user?.token) {
      alert('Please log in to add movies to your watchlist');
      return;
    }
    if (!movie?._id) {
      alert('Movie ID not found');
      return;
    }
    setAddingToWatchlist(true);
    try {
      if (isInWatchlist) {
        await removeFromWatchlist(movie._id, user.token);
        // Re-fetch watchlist to ensure state is accurate
        if (user?.token && movie?._id) {
          const watchlist = await fetchWatchlist(user.token);
          setIsInWatchlist(Array.isArray(watchlist) && watchlist.some(m => m._id === movie._id));
        } else {
          setIsInWatchlist(false);
        }
        alert('Removed from watchlist');
      } else {
        await addToWatchlist(movie._id, user.token);
        setIsInWatchlist(true);
        alert('Added to watchlist');
      }
    } catch (err) {
      console.error('Error updating watchlist:', err);
      alert(err.response?.data?.message || 'Failed to update watchlist');
    } finally {
      setAddingToWatchlist(false);
    }
  };


  // Track recently watched when video is played (must be before any return)
  useEffect(() => {
    if (showVideo && user?.token && movie?._id) {
      // Initial update when video is opened
      updateRecentlyWatched(movie._id, videoPosition, user.token).catch(() => {});
    }
    // eslint-disable-next-line
  }, [showVideo]);

  if (loading) {
    return <div style={{ padding: '2rem', textAlign: 'center' }}>Loading...</div>;
  }

  if (error) {
    return <div style={{ padding: '2rem', textAlign: 'center', color: '#ff6b6b' }}>{error}</div>;
  }

  if (!movie) {
    return <div style={{ padding: '2rem', textAlign: 'center' }}>Movie not found</div>;
  }

  // Handler for updating position (for future: resume from last position)
  const handleVideoTimeUpdate = (e) => {
    const pos = e.target.currentTime;
    setVideoPosition(pos);
    if (user?.token && movie?._id) {
      updateRecentlyWatched(movie._id, pos, user.token).catch(() => {});
    }
  };

  return (
    <div className="movie-detail">
      <div className="movie-detail-header">
        <img 
          src={movie.posterUrl || 'https://via.placeholder.com/400x600?text=' + movie.title} 
          alt={movie.title} 
          className="movie-detail-poster"
        />
        <div className="movie-detail-info">
          <h1 className="movie-detail-title">{movie.title}</h1>
          {movie.releaseDate && (
            <p className="movie-detail-year">
              {new Date(movie.releaseDate).getFullYear()}
            </p>
          )}
          {movie.genres && movie.genres.length > 0 && (
            <p className="movie-detail-genres">
              {movie.genres.join(' • ')}
            </p>
          )}
          {movie.runtimeMinutes && (
            <p className="movie-detail-runtime">
              ⏱️ {movie.runtimeMinutes} minutes
            </p>
          )}
          {movie.director && (
            <p className="movie-detail-director">
              <strong>Director:</strong> {movie.director}
            </p>
          )}
          {movie.cast && movie.cast.length > 0 && (
            <p className="movie-detail-cast">
              <strong>Cast:</strong> {movie.cast.join(', ')}
            </p>
          )}
          <div className="movie-detail-actions">
            <button 
              className="movie-detail-btn primary"
              onClick={() => setShowVideo(true)}
              disabled={!movie.videoUrl}
            >
              ▶ Play
            </button>
            <button 
              className={`movie-detail-btn secondary ${isInWatchlist ? 'in-watchlist' : ''}`}
              onClick={handleAddToWatchlist}
              disabled={addingToWatchlist}
            >
              {addingToWatchlist
                ? '...'
                : isInWatchlist
                  ? '✓ Remove from Watchlist'
                  : '+ Add to Watchlist'}
            </button>
          </div>
          {/* Video Player Modal */}
          {showVideo && movie.videoUrl && (
            <div className="modal-overlay" onClick={() => setShowVideo(false)}>
              <div className="modal-content" onClick={e => e.stopPropagation()} style={{ maxWidth: 900, width: '90vw' }}>
                <button className="close-btn" onClick={() => setShowVideo(false)} style={{ float: 'right', fontSize: '1.5rem', border: 'none', background: 'none', cursor: 'pointer' }}>✕</button>
                {movie.videoUrl.includes('youtube.com') || movie.videoUrl.includes('youtu.be') ? (
                  <div style={{ position: 'relative', paddingBottom: '56.25%', height: 0, overflow: 'hidden' }}>
                    <iframe
                      src={movie.videoUrl}
                      title="YouTube video player"
                      frameBorder="0"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                      allowFullScreen
                      style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }}
                    ></iframe>
                  </div>
                ) : (
                  <video
                    src={movie.videoUrl}
                    controls
                    autoPlay
                    style={{ width: '100%', maxHeight: '70vh', background: '#000' }}
                    onTimeUpdate={handleVideoTimeUpdate}
                  >
                    Sorry, your browser does not support embedded videos.
                  </video>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {movie.trailerUrl && movie.trailerUrl.includes('youtube.com') && (
        <div className="movie-detail-trailer">
          <h2>Trailer</h2>
          <div className="trailer-iframe-wrapper">
            <iframe
              width="560"
              height="315"
              src={movie.trailerUrl}
              title="YouTube trailer player"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            ></iframe>
          </div>
        </div>
      )}
      <div className="movie-detail-description">
        <h2>Synopsis</h2>
        <p>{movie.description}</p>
      </div>
    </div>
  );
};

export default MovieDetail;