const request = require('supertest');
const app = require('../app'); // Adjust the path as necessary
const mongoose = require('mongoose');
const Movie = require('../models/Movie');

describe('Movies API', () => {
  let movieId;

  beforeAll(async () => {
    await mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true });
  });

  afterAll(async () => {
    await mongoose.connection.close();
  });

  beforeEach(async () => {
    const movie = new Movie({
      title: 'Test Movie',
      description: 'This is a test movie.',
      genres: ['Action', 'Drama'],
      releaseDate: new Date(),
      runtimeMinutes: 120,
      cast: ['Actor 1', 'Actor 2'],
      posterUrl: 'http://example.com/poster.jpg',
      trailerUrl: 'http://example.com/trailer.mp4',
    });
    const savedMovie = await movie.save();
    movieId = savedMovie._id;
  });

  afterEach(async () => {
    await Movie.deleteMany({});
  });

  it('should list all movies', async () => {
    const res = await request(app).get('/api/movies');
    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty('movies');
    expect(res.body.movies.length).toBeGreaterThan(0);
  });

  it('should get a movie by id', async () => {
    const res = await request(app).get(`/api/movies/${movieId}`);
    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty('title', 'Test Movie');
  });

  it('should return 404 for a non-existing movie', async () => {
    const res = await request(app).get('/api/movies/123456789012345678901234');
    expect(res.statusCode).toEqual(404);
  });
});