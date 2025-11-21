import React from 'react';
import { Link } from 'react-router-dom';


const MovieCard = ({ movie }) => {
  return (
    <div className="movie-card">
      <Link to={`/movie/${movie.slug}`} tabIndex={-1}>
        <img
          src={movie.posterUrl || 'https://via.placeholder.com/220x330?text=' + movie.title}
          alt={movie.title}
          className="movie-poster"
          loading="lazy"
        />
        <div className="movie-card-info">
          <h3 className="movie-card-title">{movie.title}</h3>
          {movie.genres && (
            <div className="movie-card-genres">
              {movie.genres.slice(0, 2).join(', ')}
            </div>
          )}
          {movie.releaseDate && (
            <div className="movie-card-rating">
              {new Date(movie.releaseDate).getFullYear()}
            </div>
          )}
        </div>
        <div className="movie-card-hover">
          <Link to={`/movie/${movie.slug}`} className="movie-card-btn play" tabIndex={-1}>
            ▶
          </Link>
          <Link to={`/movie/${movie.slug}`} className="movie-card-btn info" tabIndex={-1}>
            ℹ️
          </Link>
        </div>
      </Link>
    </div>
  );
};

export default MovieCard;