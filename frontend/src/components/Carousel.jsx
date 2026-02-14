import React from 'react';
import MovieCard from './MovieCard';
import './Carousel.css';

const Carousel = ({ title, movies, onShowDetails }) => {
  if (!movies || movies.length === 0) return null;
  return (
    <div className="carousel-section fade-in">
      <h2 className="carousel-title">{title}</h2>
      <div className="carousel-row">
        {movies.map(movie => (
          <MovieCard
            key={movie._id}
            movie={movie}
            onShowDetails={onShowDetails}
            progress={movie.progress}
          />
        ))}
      </div>
    </div>
  );
};

export default Carousel;
