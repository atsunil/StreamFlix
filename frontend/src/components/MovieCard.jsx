import React, { useState, useContext } from 'react';
import { useToast } from '../context/ToastContext';
import { AuthContext } from '../context/AuthContext';
import './MovieCard.css';

const MovieCard = ({ movie, onShowDetails, progress }) => {
  const { showToast } = useToast();
  const [isHovered, setIsHovered] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const timerRef = React.useRef(null);

  const handleMouseEnter = () => {
    setIsHovered(true);
    timerRef.current = setTimeout(() => {
      if (movie.trailerUrl) {
        setIsPlaying(true);
      }
    }, 1200); // 1.2s delay before playing
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    setIsPlaying(false);
    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }
  };

  const { user, addToUserWatchlist } = useContext(AuthContext);
  const isInWatchlist = user?.watchlist?.includes(movie._id);

  const handleAddToWatchlist = async (e) => {
    e.stopPropagation();
    e.preventDefault();

    if (!user) {
      showToast('Please login to add to watchlist', 'error');
      return;
    }

    if (isInWatchlist) {
      showToast(`"${movie.title}" is already in your watchlist`, 'info');
      return;
    }

    try {
      await addToUserWatchlist(movie._id);
      showToast(`Added "${movie.title}" to watchlist`, 'success');
    } catch (error) {
      showToast('Failed to add to watchlist', 'error');
    }
  };

  // Construct efficient embed URL for preview
  const getPreviewUrl = (url) => {
    if (!url) return null;
    let embedUrl = url;
    // Ensure we have the embed version and add params
    if (url.includes('youtube.com') || url.includes('youtu.be')) {
      if (!url.includes('/embed/')) {
        // Basic conversion attempt (robust regex is better but this fits seed data)
        const videoId = url.split('v=')[1] || url.split('/').pop();
        embedUrl = `https://www.youtube.com/embed/${videoId}`;
      }
      // Add params: autoplay, mute, controls=0, modestbranding, loop, playlist (required for loop)
      const videoId = embedUrl.split('/').pop();
      return `${embedUrl}?autoplay=1&mute=1&controls=0&modestbranding=1&showinfo=0&rel=0&loop=1&playlist=${videoId}`;
    }
    return url; // Return original if not YT (e.g. mp4)
  };

  const [imgSrc, setImgSrc] = useState(movie.posterUrl);

  React.useEffect(() => {
    setImgSrc(movie.posterUrl);
  }, [movie.posterUrl]);

  return (
    <div
      className="movie-card glass-card"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onClick={() => onShowDetails(movie)}
      tabIndex={0}
    >
      {/* Video Preview Layer */}
      {isPlaying && movie.trailerUrl ? (
        <div className="movie-card-video-wrapper">
          <iframe
            src={getPreviewUrl(movie.trailerUrl)}
            title={movie.title}
            className="movie-card-video"
            allow="autoplay; encrypted-media"
            frameBorder="0"
          />
        </div>
      ) : (
        <img
          src={imgSrc || `https://placehold.co/600x900/1a1a1a/ffffff?text=${encodeURIComponent(movie.title)}`}
          alt={movie.title}
          className="movie-poster"
          loading="lazy"
          onError={(e) => {
            e.target.onerror = null;
            setImgSrc(`https://placehold.co/600x900/1a1a1a/ffffff?text=${encodeURIComponent(movie.title)}`);
          }}
        />
      )}

      {progress > 0 && !isPlaying && (
        <div className="progress-bar-container card-progress">
          <div className="progress-bar-fill" style={{ width: `${progress}%` }}></div>
        </div>
      )}

      {/* Show overlay immediately on hover, even if video hasn't started yet */}
      <div className={`movie-card-overlay ${isHovered ? 'active' : ''}`}>
        <div className="overlay-content">
          <div className="overlay-btns">
            <button className="circle-btn play" title="Play">▶</button>

            <button className={`circle-btn add ${isInWatchlist ? 'in-watchlist' : ''}`} title={isInWatchlist ? "Already in Watchlist" : "Add to Watchlist"} onClick={handleAddToWatchlist}>
              {isInWatchlist ? '✓' : '+'}
            </button>
            <button className="circle-btn info" title="Details">ℹ</button>
          </div>
          <h3 className="overlay-title">{movie.title}</h3>
          <div className="overlay-meta">
            <span className="meta-item">{movie.genres?.[0]}</span>
            <span className="meta-dot">•</span>
            <span className="meta-item">{new Date(movie.releaseDate).getFullYear()}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MovieCard;