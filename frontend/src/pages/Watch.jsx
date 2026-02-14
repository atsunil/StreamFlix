import React, { useEffect, useState, useContext, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { fetchMovieDetails, updateRecentlyWatched } from '../api/api';
import { AuthContext } from '../context/AuthContext';
import './Watch.css';

const Watch = () => {
    const { slug } = useParams();
    const navigate = useNavigate();
    const { user } = useContext(AuthContext);
    const [movie, setMovie] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const videoRef = useRef(null);

    useEffect(() => {
        const loadMovie = async () => {
            try {
                const data = await fetchMovieDetails(slug);
                if (data) {
                    setMovie(data);
                } else {
                    setError('Movie not found');
                }
            } catch (err) {
                console.error(err);
                setError('Failed to load movie');
            } finally {
                setLoading(false);
            }
        };
        loadMovie();
    }, [slug]);

    useEffect(() => {
        // Hide overflow on body when watching
        document.body.style.overflow = 'hidden';
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, []);

    const handleBack = () => {
        navigate(-1); // Go back to previous page
    };

    const handleVideoTimeUpdate = (e) => {
        // Only update progress every 5 seconds or so to avoid spamming API
        // For simplicity we just update state/API blindly here but in prod you'd debounce
        const pos = e.target.currentTime;
        // Debounce logic could go here
        if (user?.token && movie?._id && Math.floor(pos) % 10 === 0) {
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
        // Add autoplay and enable JS api
        return videoId ? `https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0&modestbranding=1` : url;
    };

    if (loading) return (
        <div className="watch-page">
            <div className="watch-loading">Loading Player...</div>
        </div>
    );

    if (error || !movie) return (
        <div className="watch-page">
            <button className="watch-back-btn" onClick={handleBack}>← Back</button>
            <div className="watch-error">⚠️ {error || 'Content unavailable'}</div>
        </div>
    );

    // Fallback chain: Video > MovieUrl > Trailer
    const videoSource = getYouTubeEmbedUrl(movie.movieUrl || movie.videoUrl || movie.trailerUrl);
    const isYouTube = videoSource && videoSource.includes('youtube.com/embed');

    return (
        <div className="watch-page">
            <button className="watch-back-btn" onClick={handleBack}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="19" y1="12" x2="5" y2="12"></line>
                    <polyline points="12 19 5 12 12 5"></polyline>
                </svg>
                Back
            </button>

            {movie && <div className="watch-overlay-title">{movie.title}</div>}

            <div className="watch-video-container">
                {isYouTube ? (
                    <iframe
                        src={videoSource}
                        title={movie.title}
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                    />
                ) : (
                    <video
                        ref={videoRef}
                        src={videoSource}
                        controls
                        autoPlay
                        onTimeUpdate={handleVideoTimeUpdate}
                        controlsList="nodownload"
                    >
                        Your browser does not support the video tag.
                    </video>
                )}
            </div>
        </div>
    );
};

export default Watch;
