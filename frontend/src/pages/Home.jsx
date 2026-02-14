import React, { useEffect, useState, useContext, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import Carousel from '../components/Carousel';
import Skeleton from '../components/Skeleton';
import MovieDetailsModal from '../components/MovieDetailsModal';
import FilterBar from '../components/FilterBar';
import { fetchMovies, fetchRecommendations } from '../api/api';
import { AuthContext } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import './Home.css';

const HomeSkeleton = () => (
  <div className="home-skeleton">
    <div className="hero-skeleton">
      <Skeleton height="450px" borderRadius="0 0 32px 32px" />
    </div>
    <div className="carousel-skeleton-row" style={{ padding: '0 4vw', marginTop: '2rem' }}>
      <Skeleton width="200px" height="30px" className="mb-4" />
      <div style={{ display: 'flex', gap: '1.5rem' }}>
        {[...Array(5)].map((_, i) => <Skeleton key={i} width="220px" height="330px" />)}
      </div>
    </div>
  </div>
);

const Home = ({ search = "" }) => {
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  const { showToast } = useToast();

  const [movies, setMovies] = useState([]);
  const [slideIndex, setSlideIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [recommendations, setRecommendations] = useState([]);
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [selectedGenres, setSelectedGenres] = useState([]);
  const [sortBy, setSortBy] = useState('newest');
  const [language, setLanguage] = useState('All');
  const [yearRange, setYearRange] = useState(2026);

  const allGenres = [
    'Action', 'Adventure', 'Animation', 'Comedy', 'Crime', 'Documentary',
    'Drama', 'Fantasy', 'Horror', 'Mystery', 'Romance', 'Sci-Fi',
    'Thriller', 'War', 'Western', 'Musical', 'Family', 'Biography'
  ];

  const getMovies = useCallback(async () => {
    try {
      const data = await fetchMovies();
      const moviesWithProgress = data.map((m, idx) => ({
        ...m,
        progress: idx === 0 ? 65 : idx === 2 ? 30 : 0
      }));
      setMovies(moviesWithProgress);
    } catch (err) {
      console.error(err);
      setError(err.message);
    } finally {
      setTimeout(() => setLoading(false), 800);
    }
  }, []);

  useEffect(() => {
    getMovies();
  }, [getMovies]);

  useEffect(() => {
    if (!movies || movies.length === 0) return;
    const interval = setInterval(() => {
      setSlideIndex(prev => (prev + 1) % Math.min(movies.length, 5));
    }, 5000);
    return () => clearInterval(interval);
  }, [movies]);

  useEffect(() => {
    const fetchUserExtras = async () => {
      if (user?.token) {
        try {
          const recs = await fetchRecommendations(user.token);
          setRecommendations(recs);
        } catch (e) { }
      } else {
        setRecommendations([]);
      }
    };
    fetchUserExtras();
  }, [user]);

  const toggleGenre = (genre) => {
    setSelectedGenres(prev =>
      prev.includes(genre) ? prev.filter(g => g !== genre) : [...prev, genre]
    );
  };

  const handleShowDetails = (movie) => setSelectedMovie(movie);
  const handleCloseDetails = () => setSelectedMovie(null);

  const handleAddToWatchlist = (movie) => {
    showToast(`Added "${movie.title}" to watchlist`, 'success');
  };

  const handlePlay = (movie) => {
    navigate(`/watch/${movie.slug}`);
  };

  if (loading) return <HomeSkeleton />;

  if (error) return (
    <div className="home">
      <div className="error glass-card" style={{ margin: '100px auto', maxWidth: '500px' }}>⚠️ Error: {error}</div>
    </div>
  );

  let filteredMovies = search.trim()
    ? movies.filter(m =>
      m.title?.toLowerCase().includes(search.toLowerCase()) ||
      m.description?.toLowerCase().includes(search.toLowerCase()) ||
      (Array.isArray(m.genres) && m.genres.some(g => g.toLowerCase().includes(search.toLowerCase())))
    )
    : movies;

  if (selectedGenres.length > 0) {
    filteredMovies = filteredMovies.filter(m =>
      m.genres?.some(g => selectedGenres.includes(g))
    );
  }

  if (language !== 'All') {
    filteredMovies = filteredMovies.filter(m => m.language === language);
  }

  filteredMovies = filteredMovies.filter(m => {
    const year = m.releaseDate ? new Date(m.releaseDate).getFullYear() : 0;
    return year <= yearRange;
  });

  if (sortBy === 'newest') {
    filteredMovies.sort((a, b) => new Date(b.releaseDate) - new Date(a.releaseDate));
  } else if (sortBy === 'rating') {
    filteredMovies.sort((a, b) => (b.rating || 0) - (a.rating || 0));
  } else if (sortBy === 'popular') {
    filteredMovies.sort((a, b) => (b.views || 0) - (a.views || 0));
  }

  const featuredMovies = filteredMovies.slice(0, 5);
  const currentSlide = featuredMovies[slideIndex] || (filteredMovies.length > 0 ? filteredMovies[0] : null);

  const sciFiMovies = movies.filter(m => m.genres?.includes('Sci-Fi'));
  const continueWatching = movies.filter(m => m.progress > 0);

  // Group movies by genre for display
  const genreSections = (() => {
    const genreMap = {};
    filteredMovies.forEach(movie => {
      if (Array.isArray(movie.genres)) {
        movie.genres.forEach(genre => {
          if (!genreMap[genre]) genreMap[genre] = [];
          genreMap[genre].push(movie);
        });
      }
    });
    return Object.keys(genreMap).sort().map(genre => ({
      title: genre,
      movies: genreMap[genre]
    }));
  })();

  return (
    <div className="home fade-in">
      {selectedMovie && (
        <MovieDetailsModal
          movie={selectedMovie}
          onClose={handleCloseDetails}
          onAddToWatchlist={handleAddToWatchlist}
          onPlay={handlePlay}
        />
      )}

      {currentSlide ? (
        <div className="hero" style={{
          backgroundImage: `linear-gradient(90deg, var(--bg-dark) 40%, transparent 100%), url('${currentSlide.posterUrl || 'https://via.placeholder.com/800x400?text=Featured+Movie'}')`
        }}>
          <div className="hero-content">
            {user && <span className="welcome-badge">Welcome back, {user.name}</span>}
            <h1 className="hero-title">{currentSlide.title}</h1>
            <div className="hero-description">{currentSlide.description}</div>
            <div className="hero-buttons">
              <button onClick={() => handlePlay(currentSlide)} className="hero-btn primary">▶ Watch Now</button>
              <button onClick={() => handleShowDetails(currentSlide)} className="hero-btn secondary">More Info</button>
            </div>
          </div>
          <div className="hero-slideshow-nav">
            {featuredMovies.map((_, idx) => (
              <button
                key={idx}
                className={"hero-slide-dot" + (slideIndex === idx ? " active" : "")}
                onClick={() => setSlideIndex(idx)}
              />
            ))}
          </div>
        </div>
      ) : (
        <div style={{ height: '100px' }}></div>
      )}

      <FilterBar
        genres={allGenres}
        selectedGenres={selectedGenres}
        onToggleGenre={toggleGenre}
        sortBy={sortBy}
        onSortChange={setSortBy}
        language={language}
        onLanguageChange={setLanguage}
        yearRange={yearRange}
        onYearChange={setYearRange}
      />

      <div className="sections-container">
        {continueWatching.length > 0 && !search && selectedGenres.length === 0 && (
          <Carousel title="Continue Watching" movies={continueWatching} onShowDetails={handleShowDetails} />
        )}

        {recommendations.length > 0 && !search && selectedGenres.length === 0 && (
          <Carousel title="Recommended For You ✨" movies={recommendations} onShowDetails={handleShowDetails} />
        )}

        {sciFiMovies.length > 0 && !search && selectedGenres.length === 0 && (
          <Carousel title="Because you watched Sci-Fi AI" movies={sciFiMovies} onShowDetails={handleShowDetails} />
        )}

        {filteredMovies.length === 0 ? (
          <div className="no-movies glass-card">
            <p>🎬 No movies found matching your criteria</p>
          </div>
        ) : (
          genreSections.map(section => (
            <Carousel key={section.title} title={section.title} movies={section.movies} onShowDetails={handleShowDetails} />
          ))
        )}
      </div>
    </div>
  );
};

export default Home;