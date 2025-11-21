import React from 'react';
import MovieCard from './MovieCard';
import './Carousel.css';

const Carousel = ({ title, movies }) => {
  if (!movies || movies.length === 0) return null;
  return (
    <div className="carousel-section">
      <h2 className="carousel-title">{title}</h2>
      <div className="carousel-row">
        {movies.map(movie => (
          <MovieCard key={movie._id} movie={movie} />
        ))}
      </div>
    </div>
  );
};

export default Carousel;
