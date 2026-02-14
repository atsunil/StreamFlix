import React, { useEffect, useState, useContext, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { fetchMovieDetails, addToWatchlist, removeFromWatchlist, updateRecentlyWatched, fetchWatchlist } from '../api/api';
import { AuthContext } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import Skeleton from '../components/Skeleton';
import './MovieDetail.css';

const MovieDetail = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  const { showToast } = useToast();

  const [movie, setMovie] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isInWatchlist, setIsInWatchlist] = useState(false);
  const [addingToWatchlist, setAddingToWatchlist] = useState(false);
  const [showVideo, setShowVideo] = useState(false);
  const [videoPosition, setVideoPosition] = useState(0);
  const [bgImage, setBgImage] = useState(null); // Moved up

  // Effect for fetching movie details
  const getMovieDetailsAndWatchlist = useCallback(async () => {
    try {
      const data = await fetchMovieDetails(slug);
      setMovie(data);
      if (user?.token && data?._id) {
        const watchlist = await fetchWatchlist(user.token);
        setIsInWatchlist(Array.isArray(watchlist) && watchlist.some(m => m._id === data._id));
      }
    } catch (err) {
      console.error(err);
      setError('Cinematic data unavailable');
    } finally {
      setTimeout(() => setLoading(false), 800);
    }
  }, [slug, user]);

  useEffect(() => {
    getMovieDetailsAndWatchlist();
  }, [getMovieDetailsAndWatchlist]);

  // Effect for background image prefetching - Moved up
  useEffect(() => {
    if (movie?.posterUrl) {
      setBgImage(movie.posterUrl); // Optimistic set
      const img = new Image();
      img.src = movie.posterUrl;
      img.onload = () => setBgImage(movie.posterUrl);
      img.onerror = () => setBgImage(null); // Fallback to gradient only or placeholder
    }
  }, [movie]);

  const handleWatchlistAction = async () => {
    if (!user) {
      showToast('Identification required to manage watchlist', 'info');
      navigate('/login');
      return;
    }
    setAddingToWatchlist(true);
    try {
      if (isInWatchlist) {
        await removeFromWatchlist(movie._id, user.token);
        setIsInWatchlist(false);
        showToast(`"${movie.title}" removed from library`, 'info');
      } else {
        await addToWatchlist(movie._id, user.token);
        setIsInWatchlist(true);
        showToast(`"${movie.title}" added to library`, 'success');
      }
    } catch (err) {
      showToast('Action failed', 'error');
    } finally {
      setAddingToWatchlist(false);
    }
  };

  const handleVideoTimeUpdate = (e) => {
    const pos = e.target.currentTime;
    setVideoPosition(pos);
    if (user?.token && movie?._id) {
      updateRecentlyWatched(movie._id, pos, user.token).catch(() => { });
    }
  };

  const getYouTubeEmbedUrl = (url) => {
    if (!url || (!url.includes('youtube.com') && !url.includes('youtu.be'))) return url;
    let videoId = '';
    if (url.includes('v=')) {
      videoId = url.split('v=')[1]?.split('&')[0];
    } else if (url.includes('youtu.be/')) {
      videoId = url.split('youtu.be/')[1]?.split('?')[0];
    }
    return videoId ? `https://www.youtube.com/embed/${videoId}?autoplay=1` : url;
  };

  if (loading) return (
    <div className="movie-detail-skeleton" style={{ padding: '100px 4vw' }}>
      <Skeleton height="500px" borderRadius="20px" />
      <div style={{ marginTop: '2rem' }}>
        <Skeleton width="40%" height="40px" className="mb-4" />
        <Skeleton width="100%" height="100px" />
      </div>
    </div>
  );

  if (error || !movie) return <div className="detail-error glass-card">⚠️ {error || 'Movie not found'}</div>;

  const movieEmbedUrl = getYouTubeEmbedUrl(movie.movieUrl || movie.videoUrl || movie.trailerUrl);
  const trailerEmbedUrl = getYouTubeEmbedUrl(movie.trailerUrl);

  return (
    <div className="movie-detail fade-in">
      <div className="detail-hero" style={{ backgroundImage: `linear-gradient(to top, var(--bg-dark), transparent), url(${bgImage || `https://placehold.co/1200x800/1a1a1a/ffffff?text=${encodeURIComponent(movie.title)}`})` }}>
        <div className="detail-hero-content">
          <h1 className="detail-title">{movie.title}</h1>
          <div className="detail-meta">
            <span>{new Date(movie.releaseDate).getFullYear()}</span>
            <span className="meta-sep">|</span>
            <span>{movie.runtimeMinutes} min</span>
            <span className="meta-sep">|</span>
            <span className="genre-label">{movie.genres?.join(', ')}</span>
          </div>
          <p className="detail-desc">{movie.description}</p>

          <div className="detail-actions">
            <button className="btn-play" onClick={() => navigate(`/watch/${slug}`)}>▶ Play Now</button>
            <button
              className={`btn-watchlist ${isInWatchlist ? 'active' : ''}`}
              onClick={handleWatchlistAction}
              disabled={addingToWatchlist}
            >
              {isInWatchlist ? '✓ In Watchlist' : '+ Add to Watchlist'}
            </button>
          </div>
        </div>
      </div>

      <div className="detail-bottom-grid">
        <div className="detail-sidebar glass-card">
          <h3>Cast & Crew</h3>
          <div className="sidebar-group">
            <label>Director</label>
            <p>{movie.director}</p>
          </div>
          <div className="sidebar-group">
            <label>Starring</label>
            <p>{movie.cast?.join(', ')}</p>
          </div>
          <div className="sidebar-group">
            <label>Language</label>
            <p>{movie.language}</p>
          </div>
        </div>

        <div className="detail-trailer-container">
          <h3>Official Trailer</h3>
          {trailerEmbedUrl ? (
            <div className="video-wrapper glass-card">
              <iframe
                src={trailerEmbedUrl}
                title="Trailer"
                frameBorder="0"
                allowFullScreen
              ></iframe>
            </div>
          ) : (
            <p className="no-trailer">No trailer available for this entry.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default MovieDetail;