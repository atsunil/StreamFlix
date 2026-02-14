const bcrypt = require('bcrypt');
const User = require('../backend/src/models/User');

const seedUsers = [
  {
    name: 'Admin User',
    email: 'admin@example.com',
    password: 'password123', // Will be hashed
    role: 'admin',
  },
  {
    name: 'Regular User',
    email: 'user@example.com',
    password: 'password123', // Will be hashed
    role: 'user',
  },
];
require('dotenv').config({ path: './backend/.env' });

const mongoose = require('mongoose');
const Movie = require('../backend/src/models/Movie');


const seedMovies = [
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
    posterUrl: 'https://example.com/inception.jpg',
    trailerUrl: 'https://example.com/inception_trailer.mp4',
    videoUrl: 'https://example.com/inception_full.mp4',
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
    posterUrl: 'https://example.com/the_matrix.jpg',
    trailerUrl: 'https://example.com/the_matrix_trailer.mp4',
    videoUrl: 'https://example.com/the_matrix_full.mp4',
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
    posterUrl: 'https://example.com/interstellar.jpg',
    trailerUrl: 'https://example.com/interstellar_trailer.mp4',
    videoUrl: 'https://example.com/interstellar_full.mp4',
  },
  {
    title: 'Parasite',
    slug: 'parasite',
    description: 'Greed and class discrimination threaten the newly formed symbiotic relationship between the wealthy Park family and the destitute Kim clan.',
    genres: ['Drama', 'Thriller'],
    releaseDate: new Date('2019-05-30'),
    runtimeMinutes: 132,
    cast: ['Song Kang-ho', 'Lee Sun-kyun', 'Cho Yeo-jeong'],
    director: 'Bong Joon-ho',
    language: 'Korean',
    posterUrl: 'https://example.com/parasite.jpg',
    trailerUrl: 'https://example.com/parasite_trailer.mp4',
    videoUrl: 'https://example.com/parasite_full.mp4',
  },
  {
    title: 'The Godfather',
    slug: 'the-godfather',
    description: 'The aging patriarch of an organized crime dynasty transfers control of his clandestine empire to his reluctant son.',
    genres: ['Crime', 'Drama'],
    releaseDate: new Date('1972-03-24'),
    runtimeMinutes: 175,
    cast: ['Marlon Brando', 'Al Pacino', 'James Caan'],
    director: 'Francis Ford Coppola',
    language: 'English',
    posterUrl: 'https://example.com/godfather.jpg',
    trailerUrl: 'https://example.com/godfather_trailer.mp4',
    videoUrl: 'https://example.com/godfather_full.mp4',
  },
  {
    title: 'Spirited Away',
    slug: 'spirited-away',
    description: 'During her family\'s move to the suburbs, a sullen 10-year-old girl wanders into a world ruled by gods, witches, and spirits.',
    genres: ['Animation', 'Adventure', 'Family'],
    releaseDate: new Date('2001-07-20'),
    runtimeMinutes: 125,
    cast: ['Rumi Hiiragi', 'Miyu Irino', 'Mari Natsuki'],
    director: 'Hayao Miyazaki',
    language: 'Japanese',
    posterUrl: 'https://example.com/spirited_away.jpg',
    trailerUrl: 'https://example.com/spirited_away_trailer.mp4',
    videoUrl: 'https://example.com/spirited_away_full.mp4',
  },
  {
    title: 'Black Panther',
    slug: 'black-panther',
    description: 'T\'Challa, heir to the hidden but advanced kingdom of Wakanda, must step forward to lead his people into a new future.',
    genres: ['Action', 'Adventure', 'Sci-Fi'],
    releaseDate: new Date('2018-02-16'),
    runtimeMinutes: 134,
    cast: ['Chadwick Boseman', 'Michael B. Jordan', 'Lupita Nyong\'o'],
    director: 'Ryan Coogler',
    language: 'English',
    posterUrl: 'https://example.com/black_panther.jpg',
    trailerUrl: 'https://example.com/black_panther_trailer.mp4',
    videoUrl: 'https://example.com/black_panther_full.mp4',
  },
  {
    title: 'Amélie',
    slug: 'amelie',
    description: 'Amélie is an innocent and naive girl in Paris with her own sense of justice.',
    genres: ['Comedy', 'Romance'],
    releaseDate: new Date('2001-04-25'),
    runtimeMinutes: 122,
    cast: ['Audrey Tautou', 'Mathieu Kassovitz', 'Rufus'],
    director: 'Jean-Pierre Jeunet',
    language: 'French',
    posterUrl: 'https://example.com/amelie.jpg',
    trailerUrl: 'https://example.com/amelie_trailer.mp4',
    videoUrl: 'https://example.com/amelie_full.mp4',
  },
];


const seedDatabase = async () => {
  let connection;
  try {
    const dbUri = process.env.DATABASE_URL || process.env.MONGODB_URI;
    if (!dbUri) {
      throw new Error('DATABASE_URL not set in .env');
    }
    console.log('Connecting to:', dbUri);
    
    connection = await mongoose.connect(dbUri, { 
      serverSelectionTimeoutMS: 60000,
      socketTimeoutMS: 120000,
      connectTimeoutMS: 60000,
      maxPoolSize: 10,
      minPoolSize: 5,
      bufferCommands: true
    });
    console.log('✓ Connected to MongoDB');

    // Wait for connection to fully stabilize
    await new Promise(resolve => setTimeout(resolve, 2000));
    await new Promise(resolve => setTimeout(resolve, 2000));

    // Verify connection is ready
    if (mongoose.connection.readyState !== 1) {
      throw new Error(`MongoDB connection not ready. State: ${mongoose.connection.readyState}`);
    }
    console.log('✓ Connection ready');

    console.log('Clearing old data...');
    try {
      // Use native MongoDB client for direct access
      const db = mongoose.connection.db;
      await db.collection('movies').deleteMany({});
      await db.collection('users').deleteMany({});
      console.log('✓ Collections cleared');
    } catch (e) {
      console.log('Note: Collections already empty or do not exist');
    }

    console.log('Seeding movies...');
    try {
      const db = mongoose.connection.db;
      const result = await db.collection('movies').insertMany(seedMovies, { ordered: false });
      console.log(`✓ ${result.insertedCount} movies seeded`);
    } catch (insertError) {
      if (insertError.code === 11000) {
        console.log('⚠ Some movies already exist (duplicates), continuing...');
      } else {
        throw insertError;
      }
    }

    console.log('Seeding users...');
    // Hash passwords before creating users
    const hashedUsers = await Promise.all(seedUsers.map(async user => ({
      ...user,
      passwordHash: await bcrypt.hash(user.password, 10),
      password: undefined
    })));
    try {
      const db = mongoose.connection.db;
      const result = await db.collection('users').insertMany(hashedUsers, { ordered: false });
      console.log(`✓ ${result.insertedCount} users seeded`);
      console.log('  Admin: admin@example.com / password123');
      console.log('  User:  user@example.com / password123');
    } catch (insertError) {
      if (insertError.code === 11000) {
        console.log('⚠ Some users already exist (duplicates), continuing...');
      } else {
        throw insertError;
      }
    }

    await mongoose.disconnect();
    console.log('✓ Database seeding completed successfully');
    process.exit(0);
  } catch (error) {
    console.error('✗ Error seeding database:', error.message);
    if (connection) await mongoose.disconnect();
    process.exit(1);
  }
};

seedDatabase();