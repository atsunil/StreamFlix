const Movie = require('../models/Movie');

// Sample movies for demo purposes
const SAMPLE_MOVIES = [
  {
    _id: '1',
    title: 'Inception',
    slug: 'inception',
    description: 'A thief who steals corporate secrets through the use of dream-sharing technology.',
    genres: ['Action', 'Sci-Fi', 'Thriller'],
    releaseDate: new Date('2010-07-16'),
    runtimeMinutes: 148,
    cast: ['Leonardo DiCaprio', 'Joseph Gordon-Levitt', 'Elliot Page'],
    director: 'Christopher Nolan',
    language: 'English',
    posterUrl: 'https://via.placeholder.com/180x270?text=Inception',
    trailerUrl: 'https://youtube.com/embed/YoHD_XwIlPw',
    videoUrl: 'https://example.com/inception_full.mp4',
    isPublished: true,
  },
  {
    _id: '2',
    title: 'The Matrix',
    slug: 'the-matrix',
    description: 'A computer hacker learns from mysterious rebels about the true nature of his reality.',
    genres: ['Action', 'Sci-Fi'],
    releaseDate: new Date('1999-03-31'),
    runtimeMinutes: 136,
    cast: ['Keanu Reeves', 'Laurence Fishburne', 'Carrie-Anne Moss'],
    director: 'Lana Wachowski, Lilly Wachowski',
    language: 'English',
    posterUrl: 'https://via.placeholder.com/180x270?text=The+Matrix',
    trailerUrl: 'https://youtube.com/embed/vKQi3bBA1y8',
    videoUrl: 'https://example.com/the_matrix_full.mp4',
    isPublished: true,
  },
  {
    _id: '3',
    title: 'Interstellar',
    slug: 'interstellar',
    description: 'A team of explorers travel through a wormhole in space in an attempt to ensure humanity\'s survival.',
    genres: ['Adventure', 'Drama', 'Sci-Fi'],
    releaseDate: new Date('2014-11-07'),
    runtimeMinutes: 169,
    cast: ['Matthew McConaughey', 'Anne Hathaway', 'Jessica Chastain'],
    director: 'Christopher Nolan',
    language: 'English',
    posterUrl: 'https://via.placeholder.com/180x270?text=Interstellar',
    trailerUrl: 'https://youtube.com/embed/zSWdZVtXT7E',
    videoUrl: 'https://example.com/interstellar_full.mp4',
    isPublished: true,
  },
  {
    _id: '4',
    title: 'The Dark Knight',
    slug: 'the-dark-knight',
    description: 'When the menace known as the Joker wreaks havoc and chaos on the people of Gotham, Batman must accept one of the greatest psychological and physical tests.',
    genres: ['Action', 'Crime', 'Drama'],
    releaseDate: new Date('2008-07-18'),
    runtimeMinutes: 152,
    cast: ['Christian Bale', 'Heath Ledger', 'Aaron Eckhart'],
    director: 'Christopher Nolan',
    language: 'English',
    posterUrl: 'https://via.placeholder.com/180x270?text=The+Dark+Knight',
    trailerUrl: 'https://youtube.com/embed/EXeTwQWrcwY',
    videoUrl: 'https://example.com/dark_knight_full.mp4',
    isPublished: true,
  },
  {
    _id: '5',
    title: 'Oppenheimer',
    slug: 'oppenheimer',
    description: 'The story of American scientist J. Robert Oppenheimer and his role in the development of the atomic bomb during World War II.',
    genres: ['Biography', 'Drama', 'History'],
    releaseDate: new Date('2023-07-21'),
    runtimeMinutes: 180,
    cast: ['Cillian Murphy', 'Robert Downey Jr.', 'Emily Blunt'],
    director: 'Christopher Nolan',
    language: 'English',
    posterUrl: 'https://via.placeholder.com/180x270?text=Oppenheimer',
    trailerUrl: 'https://youtube.com/embed/uYPbbksJxIg',
    videoUrl: 'https://example.com/oppenheimer_full.mp4',
    isPublished: true,
  },
  {
    _id: '6',
    title: 'Titanic',
    slug: 'titanic',
    description: 'A seventeen-year-old aristocrat falls in love with a kind but poor artist aboard the luxurious, ill-fated R.M.S. Titanic.',
    genres: ['Drama', 'Romance'],
    releaseDate: new Date('1997-12-19'),
    runtimeMinutes: 194,
    cast: ['Leonardo DiCaprio', 'Kate Winslet', 'Billy Zane'],
    director: 'James Cameron',
    language: 'English',
    posterUrl: 'https://via.placeholder.com/180x270?text=Titanic',
    trailerUrl: 'https://youtube.com/embed/CHYRf73UF3I',
    videoUrl: 'https://example.com/titanic_full.mp4',
    isPublished: true,
  },
];

async function getMovies(req, res, next) {
  try {
    const movies = await Movie.find({ isPublished: true }).limit(50);
    res.json(movies);
  } catch (err) {
    next(err);
  }
}

async function getMovieBySlug(req, res, next) {
  try {
    let movie;
    try {
      movie = await Movie.findOne({ slug: req.params.slug });
      if (!movie) {
        // Try sample movies as fallback
        movie = SAMPLE_MOVIES.find(m => m.slug === req.params.slug);
      }
    } catch (dbErr) {
      console.error('DB error:', dbErr.message);
      // Try sample movies if DB fails
      movie = SAMPLE_MOVIES.find(m => m.slug === req.params.slug);
    }
    if (!movie) return res.status(404).json({ message: 'Not found' });
    res.json(movie);
  } catch (err) {
    next(err);
  }
}

async function createMovie(req, res, next) {
  try {
    const body = req.body;
    const movie = await Movie.create(body);
    res.status(201).json(movie);
  } catch (err) {
    next(err);
  }
}

async function deleteMovie(req, res, next) {
  try {
    await Movie.findByIdAndDelete(req.params.id);
    res.status(204).end();
  } catch (err) {
    next(err);
  }
}

module.exports = {
  getMovies,
  getMovieBySlug,
  createMovie,
  deleteMovie
};