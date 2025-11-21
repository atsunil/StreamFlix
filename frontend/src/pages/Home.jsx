import React, { useEffect, useState, useContext } from 'react';
import MovieCard from '../components/MovieCard';
import Carousel from '../components/Carousel';
import { fetchMovies, fetchRecommendations } from '../api/api';
import { AuthContext } from '../context/AuthContext';


const Home = ({ search = "" }) => {
  const [movies, setMovies] = useState([]);
  const [slideIndex, setSlideIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [continueWatching, setContinueWatching] = useState([]);
  const [recommendations, setRecommendations] = useState([]);
  const { user } = useContext(AuthContext);

  useEffect(() => {
    const getMovies = async () => {
      try {
        const data = await fetchMovies();
        setMovies(data);
      } catch (err) {
        console.error('Error fetching movies:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    getMovies();
  }, []);

  // Slideshow effect for hero
  useEffect(() => {
    if (!movies || movies.length === 0) return;
    const interval = setInterval(() => {
      setSlideIndex(prev => (prev + 1) % Math.min(movies.length, 5));
    }, 5000);
    return () => clearInterval(interval);
  }, [movies]);

  // Fetch continue watching and recommendations for logged-in users
  useEffect(() => {
    const fetchUserExtras = async () => {
      if (user?.token) {
        try {
          // Get recently watched (continue watching)
          const res = await fetch(
            (import.meta.env.VITE_API_URL || 'http://localhost:5000/api') + '/users/me',
            { headers: { Authorization: `Bearer ${user.token}` } }
          );
          const userData = await res.json();
          if (userData.recentlyWatched) {
            setContinueWatching(userData.recentlyWatched.map(e => ({ ...e.movie, position: e.position })));
          }
          // Get recommendations
          const recs = await fetchRecommendations(user.token);
          setRecommendations(recs);
        } catch (e) {
          // ignore
        }
      } else {
        setContinueWatching([]);
        setRecommendations([]);
      }
    };
    fetchUserExtras();
  }, [user]);

  if (loading) return (
    <div className="home">
      <div className="loading">Loading StreamFlix...</div>
    </div>
  );
  
  if (error) return (
    <div className="home">
      <div className="error">⚠️ Error: {error}</div>
    </div>
  );


    // Filter movies by search
    const filteredMovies = search.trim()
      ? movies.filter(m =>
          m.title?.toLowerCase().includes(search.toLowerCase()) ||
          m.description?.toLowerCase().includes(search.toLowerCase()) ||
          (Array.isArray(m.genres) && m.genres.some(g => g.toLowerCase().includes(search.toLowerCase())))
        )
      : movies;

    // Slideshow: pick up to 5 featured movies
    const featuredMovies = filteredMovies.slice(0, 5);
    const currentSlide = featuredMovies[slideIndex] || null;

    return (
      <div className="home">
        {currentSlide && (
          <div className="hero" style={{ backgroundImage: `linear-gradient(90deg, #141414 60%, rgba(20,20,20,0.7) 100%), url('${currentSlide.posterUrl || 'https://via.placeholder.com/800x400?text=Featured+Movie'}')` }}>
            <div className="hero-content">
              <h1 className="hero-title">{currentSlide.title}</h1>
              <div className="hero-description">{currentSlide.description}</div>
              <div className="hero-buttons">
                <a href={"/movie/" + currentSlide.slug} className="hero-btn">▶ Play</a>
                <a href={"/movie/" + currentSlide.slug} className="hero-btn secondary">More Info</a>
              </div>
              {/* Slideshow navigation */}
              <div className="hero-slideshow-nav">
                {featuredMovies.map((_, idx) => (
                  <button
                    key={idx}
                    className={"hero-slide-dot" + (slideIndex === idx ? " active" : "")}
                    onClick={() => setSlideIndex(idx)}
                    aria-label={`Go to slide ${idx + 1}`}
                  />
                ))}
              </div>
            </div>
          </div>
        )}
        <div className="section">
          <h1 style={{display:'none'}}>StreamFlix</h1>
          {/* Continue Watching Carousel */}
          {continueWatching.length > 0 && (
            <Carousel title="Continue Watching" movies={continueWatching} />
          )}
          {/* Recommendations Carousel */}
          {recommendations.length > 0 && (
            <Carousel title="Recommended For You" movies={recommendations} />
          )}
          {filteredMovies.length === 0 ? (
            <div className="no-movies">
              <div style={{ textAlign: 'center' }}>
                <p>🎬 No movies found</p>
                <p style={{ fontSize: '0.9rem', marginTop: '1rem', color: '#666' }}>
                  Try a different search or check your connection.
                </p>
              </div>
            </div>
          ) : (
            // Group filtered movies by genre and render a carousel for each genre
            (() => {
              const genreMap = {};
              filteredMovies.forEach(movie => {
                if (Array.isArray(movie.genres)) {
                  movie.genres.forEach(genre => {
                    if (!genreMap[genre]) genreMap[genre] = [];
                    genreMap[genre].push(movie);
                  });
                }
              });
              const sortedGenres = Object.keys(genreMap).sort();
              return (
                <>
                  {sortedGenres.map(genre => (
                    <Carousel key={genre} title={genre} movies={genreMap[genre]} />
                  ))}
                </>
              );
            })()
          )}
        </div>
      </div>
    );
};

export default Home;