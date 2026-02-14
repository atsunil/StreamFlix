import React, { useEffect, useContext } from 'react';
import { createPortal } from 'react-dom';
import { AuthContext } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import './MovieDetailsModal.css';

const MovieDetailsModal = ({ movie, onClose, onPlay }) => {
    const { user, addToUserWatchlist } = useContext(AuthContext);
    const { showToast } = useToast();
    const isInWatchlist = user?.watchlist?.includes(movie._id);

    const handleAddToWatchlist = async () => {
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
    useEffect(() => {
        const handleEsc = (e) => {
            if (e.key === 'Escape') onClose();
        };
        window.addEventListener('keydown', handleEsc);
        return () => window.removeEventListener('keydown', handleEsc);
    }, [onClose]);

    const getYouTubeEmbedUrl = (url) => {
        if (!url || (!url.includes('youtube.com') && !url.includes('youtu.be'))) return url;
        let videoId = '';
        if (url.includes('v=')) {
            videoId = url.split('v=')[1]?.split('&')[0];
        } else if (url.includes('youtu.be/')) {
            videoId = url.split('youtu.be/')[1]?.split('?')[0];
        }
        return videoId ? `https://www.youtube.com/embed/${videoId}` : url;
    };

    if (!movie) return null;

    const trailerUrl = getYouTubeEmbedUrl(movie.trailerUrl);

    return createPortal(
        <div className="modal-overlay fade-in" onClick={onClose} role="dialog" aria-modal="true">
            <div className="modal-content glass-card slide-up" onClick={e => e.stopPropagation()}>
                <button className="modal-close" onClick={onClose} aria-label="Close modal">✕</button>

                <div className="modal-body">
                    <div className="modal-poster" style={{ backgroundImage: `url(${movie.posterUrl})` }}>
                        <div className="poster-overlay">
                            <button className="btn-play-large" onClick={() => onPlay(movie)}>▶ Play</button>
                        </div>
                    </div>

                    <div className="modal-info">
                        <h2 className="modal-title">{movie.title}</h2>
                        <div className="modal-meta">
                            <span className="meta-year">{new Date(movie.releaseDate).getFullYear()}</span>
                            <span className="meta-runtime">{movie.runtimeMinutes} min</span>
                            <span className="meta-genres">{movie.genres?.join(', ')}</span>
                        </div>
                        <p className="modal-desc">{movie.description}</p>

                        <div className="modal-actions">
                            <button className="btn primary" onClick={() => onPlay(movie)}>Watch Now</button>
                            <button
                                className={`btn secondary ${isInWatchlist ? 'in-watchlist' : ''}`}
                                onClick={handleAddToWatchlist}
                                style={isInWatchlist ? { borderColor: '#4caf50', color: '#4caf50' } : {}}
                            >
                                {isInWatchlist ? '✓ In Watchlist' : '+ Watchlist'}
                            </button>
                        </div>

                        {trailerUrl && (
                            <div className="modal-trailer mt-4">
                                <p className="label-small">Trailer</p>
                                <div className="trailer-preview-box">
                                    <iframe src={trailerUrl} title="Trailer" frameBorder="0" allowFullScreen style={{ width: '100%', aspectRatio: '16/9', borderRadius: '12px' }}></iframe>
                                </div>
                            </div>
                        )}

                        <div className="modal-extra mt-4">
                            <p><strong>Director:</strong> {movie.director}</p>
                            <p><strong>Cast:</strong> {movie.cast?.join(', ')}</p>
                            <p><strong>Language:</strong> {movie.language}</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>,
        document.body
    );
};

export default MovieDetailsModal;
