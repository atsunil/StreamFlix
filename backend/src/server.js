require('dotenv').config(); // MUST be first

const express = require('express');
const mongoose = require('mongoose');
const app = require('./app');
const memoryDb = require('./config/memory-db');
const Movie = require('./models/Movie');
const User = require('./models/User');
const bcrypt = require('bcrypt');
const mockStorage = require('./utils/mockStorage');

const PORT = process.env.PORT || 5000;
const DATABASE_URL = process.env.DATABASE_URL || process.env.MONGODB_URI;

async function seedData() {
  console.log('🌱 Checking seed data...');
  const movies = [
    {
      title: 'Inception',
      slug: 'inception',
      description: 'A thief who steals corporate secrets through the use of dream-sharing technology.',
      genres: ['Action', 'Sci-Fi', 'Thriller'],
      releaseDate: new Date('2010-07-16'),
      runtimeMinutes: 148,
      cast: ['Leonardo DiCaprio', 'Joseph Gordon-Levitt', 'Elliot Page'],
      director: 'Christopher Nolan',
      language: 'English',
      posterUrl: 'https://image.tmdb.org/t/p/original/xlaY2zyzMfkhk0HSC5VUwzoZPU1.jpg',
      trailerUrl: 'https://www.youtube.com/embed/YoHD_XwIlPw',
      videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
      isPublished: true,
    },
    {
      title: 'The Matrix',
      slug: 'the-matrix',
      description: 'A computer hacker learns from mysterious rebels about the true nature of his reality.',
      genres: ['Action', 'Sci-Fi'],
      releaseDate: new Date('1999-03-31'),
      runtimeMinutes: 136,
      cast: ['Keanu Reeves', 'Laurence Fishburne', 'Carrie-Anne Moss'],
      director: 'Lana Wachowski, Lilly Wachowski',
      language: 'English',
      posterUrl: 'https://image.tmdb.org/t/p/original/dXNAPwY7VrqMAo51EKhhCJfaGb5.jpg',
      trailerUrl: 'https://www.youtube.com/embed/vKQi3bBA1y8',
      videoUrl: 'https://www.youtube.com/embed/vKQi3bBA1y8',
      isPublished: true,
    },
    {
      title: 'Interstellar',
      slug: 'interstellar',
      description: 'A team of explorers travel through a wormhole in space in an attempt to ensure humanity\'s survival.',
      genres: ['Adventure', 'Drama', 'Sci-Fi'],
      releaseDate: new Date('2014-11-07'),
      runtimeMinutes: 169,
      cast: ['Matthew McConaughey', 'Anne Hathaway', 'Jessica Chastain'],
      director: 'Christopher Nolan',
      language: 'English',
      posterUrl: 'https://image.tmdb.org/t/p/original/xJHokMbljvjADYdit5fK5VQsXEG.jpg',
      trailerUrl: 'https://www.youtube.com/embed/zSWdZVtXT7E',
      videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4',
      isPublished: true,
    },
    {
      title: 'Edge of Tomorrow',
      slug: 'edge-of-tomorrow',
      description: 'A soldier fighting aliens gets to relive the same day over and over again, the day restarting every time he dies.',
      genres: ['Action', 'Sci-Fi'],
      releaseDate: new Date('2014-06-06'),
      runtimeMinutes: 113,
      cast: ['Tom Cruise', 'Emily Blunt', 'Bill Paxton'],
      director: 'Doug Liman',
      language: 'English',
      posterUrl: 'https://image.tmdb.org/t/p/original/xjw5trHV7Mwo61P0kctmj8MqPtn.jpg',
      trailerUrl: 'https://www.youtube.com/embed/yUmSVcttXnI',
      videoUrl: 'https://www.youtube.com/embed/yUmSVcttXnI',
      isPublished: true,
    },
    {
      title: 'The Dark Knight',
      slug: 'the-dark-knight',
      description: 'When the menace known as the Joker wreaks havoc and chaos on the people of Gotham, Batman must accept one of the greatest psychological and physical tests of his ability to fight injustice.',
      genres: ['Action', 'Crime', 'Drama'],
      releaseDate: new Date('2008-07-18'),
      runtimeMinutes: 152,
      cast: ['Christian Bale', 'Heath Ledger', 'Aaron Eckhart'],
      director: 'Christopher Nolan',
      language: 'English',
      posterUrl: 'https://image.tmdb.org/t/p/original/qJ2tW6WMUDux911r6m7haRef0WH.jpg',
      trailerUrl: 'https://www.youtube.com/embed/EXeTwQWrcwY',
      videoUrl: 'https://www.youtube.com/embed/EXeTwQWrcwY',
      isPublished: true,
    },
    {
      title: 'Avatar',
      slug: 'avatar',
      description: 'A paraplegic Marine dispatched to the moon Pandora on a unique mission becomes torn between following his orders and protecting the world he feels is his home.',
      genres: ['Action', 'Adventure', 'Fantasy'],
      releaseDate: new Date('2009-12-18'),
      runtimeMinutes: 162,
      cast: ['Sam Worthington', 'Zoe Saldana', 'Sigourney Weaver'],
      director: 'James Cameron',
      language: 'English',
      posterUrl: 'https://image.tmdb.org/t/p/original/jRXYjXNq0Cs2TcJjLkki24MLp7u.jpg',
      trailerUrl: 'https://www.youtube.com/embed/5PSNL1qE6VY',
      videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4',
      isPublished: true,
    },
    {
      title: 'Dune',
      slug: 'dune',
      description: 'Paul Atreides, a brilliant and gifted young man born into a great destiny beyond his understanding, must travel to the most dangerous planet in the universe to ensure the future of his family and his people.',
      genres: ['Sci-Fi', 'Adventure'],
      releaseDate: new Date('2021-10-22'),
      runtimeMinutes: 155,
      cast: ['Timothée Chalamet', 'Rebecca Ferguson', 'Oscar Isaac'],
      director: 'Denis Villeneuve',
      language: 'English',
      posterUrl: 'https://image.tmdb.org/t/p/original/d5NXSklXo0qyLX77Vx9XUcv0bQx.jpg',
      trailerUrl: 'https://www.youtube.com/embed/n9xhJrPXop4',
      videoUrl: 'https://www.youtube.com/embed/n9xhJrPXop4',
      isPublished: true,
    },
    {
      title: 'Spider-Man: Into the Spider-Verse',
      slug: 'spider-man-into-the-spider-verse',
      description: 'Teen Miles Morales becomes the Spider-Man of his universe, and must join with five spider-powered individuals from other dimensions to stop a threat for all realities.',
      genres: ['Animation', 'Action', 'Adventure'],
      releaseDate: new Date('2018-12-14'),
      runtimeMinutes: 117,
      cast: ['Shameik Moore', 'Jake Johnson', 'Hailee Steinfeld'],
      director: 'Bob Persichetti, Peter Ramsey, Rodney Rothman',
      language: 'English',
      posterUrl: 'https://image.tmdb.org/t/p/original/iiZZdoQBEYBv6id8su7ImL0oCbD.jpg',
      trailerUrl: 'https://www.youtube.com/embed/g4Hbz2jLxvQ',
      videoUrl: 'https://www.youtube.com/embed/g4Hbz2jLxvQ',
      isPublished: true,
    },
    {
      title: 'Avengers: Endgame',
      slug: 'avengers-endgame',
      description: 'After the devastating events of Avengers: Infinity War, the universe is in ruins. With the help of remaining allies, the Avengers assemble once more in order to reverse Thanos\' actions and restore balance to the universe.',
      genres: ['Action', 'Sci-Fi', 'Adventure'],
      releaseDate: new Date('2019-04-26'),
      runtimeMinutes: 181,
      cast: ['Robert Downey Jr.', 'Chris Evans', 'Mark Ruffalo'],
      director: 'Anthony Russo, Joe Russo',
      language: 'English',
      posterUrl: 'https://image.tmdb.org/t/p/original/or06FN3Dka5tukK1e9sl16pB3iy.jpg',
      trailerUrl: 'https://www.youtube.com/embed/TcMBFSGVi1c',
      videoUrl: 'https://www.youtube.com/embed/TcMBFSGVi1c',
      isPublished: true,
    },
    {
      title: 'Joker',
      slug: 'joker',
      description: 'During the 1980s, a failed stand-up comedian is driven insane and turns to a life of crime and chaos in Gotham City while becoming an infamous psychopathic crime figure.',
      genres: ['Crime', 'Thriller', 'Drama'],
      releaseDate: new Date('2019-10-04'),
      runtimeMinutes: 122,
      cast: ['Joaquin Phoenix', 'Robert De Niro', 'Zazie Beetz'],
      director: 'Todd Phillips',
      language: 'English',
      posterUrl: 'https://image.tmdb.org/t/p/original/udDclJoHjfjb8EkGsdrFKDgyh91.jpg',
      trailerUrl: 'https://www.youtube.com/embed/zAGVQLHvwOY',
      videoUrl: 'https://www.youtube.com/embed/zAGVQLHvwOY',
      isPublished: true,
    },
    {
      title: 'The Shawshank Redemption',
      slug: 'the-shawshank-redemption',
      description: 'Two imprisoned men bond over a number of years, finding solace and eventual redemption through acts of common decency.',
      genres: ['Drama', 'Crime'],
      releaseDate: new Date('1994-09-23'),
      runtimeMinutes: 142,
      cast: ['Tim Robbins', 'Morgan Freeman', 'Bob Gunton'],
      director: 'Frank Darabont',
      language: 'English',
      posterUrl: 'https://image.tmdb.org/t/p/original/q6y0Go1tsGEsmtFryDOJo3dEmqu.jpg',
      trailerUrl: 'https://www.youtube.com/embed/6hB3S9bIaco',
      videoUrl: 'https://www.youtube.com/embed/6hB3S9bIaco',
      isPublished: true,
    }
  ];

  try {
    for (const movie of movies) {
      await Movie.findOneAndUpdate(
        { slug: movie.slug },
        movie,
        { upsert: true, new: true, setDefaultsOnInsert: true }
      );
    }
    console.log(`✅ Movies synced/upserted (${movies.length} titles).`);

    // Creates an admin user if not exists
    const adminEmail = 'admin@example.com';
    const adminExists = await User.findOne({ email: adminEmail });
    if (!adminExists) {
      const passwordHash = await bcrypt.hash('password123', 10);
      await User.create({
        name: 'Admin User',
        email: adminEmail,
        passwordHash,
        role: 'admin'
      });
      console.log('✅ Admin user created: admin@example.com / password123');
    }
  } catch (err) {
    console.error('❌ Error seeding data:', err);
  }
}

async function startServer() {
  try {
    if (!DATABASE_URL) {
      console.warn('⚠️ DATABASE_URL not set. Starting in-memory database and pure mock storage...');
      await memoryDb.connect();
      await mockStorage.init();
    } else {
      await mongoose.connect(DATABASE_URL, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      });
      console.log('✅ Connected to MongoDB');
    }

    await seedData();

    app.listen(PORT, () => {
      console.log(`✅ Server is running on http://localhost:${PORT}`);
      console.log(`✅ API Base URL: http://localhost:${PORT}/api`);
    });
  } catch (err) {
    console.error('❌ Server startup error:', err);
    process.exit(1);
  }
}

startServer();