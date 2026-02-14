require('dotenv').config();
const mongoose = require('mongoose');
const Movie = require('./src/models/Movie');

const DATABASE_URL = process.env.DATABASE_URL || process.env.MONGODB_URI;

// Working poster URLs from TMDB
const posterFixes = {
    "inception": "https://image.tmdb.org/t/p/w500/ljsZTbVsrQSqNgAvMhpBfYjmSn.jpg",
    "interstellar": "https://image.tmdb.org/t/p/w500/gEU2QniE6E77NI6lCU6MxlNBvIx.jpg",
    "the-matrix": "https://image.tmdb.org/t/p/w500/f89U3ADr1oiB1s9GkdPOEpXUk5H.jpg",
    "the-dark-knight": "https://image.tmdb.org/t/p/w500/qJ2tW6WMUDux911BTUgMe1nS6wR.jpg",
    "avengers-endgame": "https://image.tmdb.org/t/p/w500/or06FN3Dka5tukK1e9sl16pB3iy.jpg",
    "shutter-island": "https://image.tmdb.org/t/p/w500/kve20tXMHZp1HBVfnt4hquejeOj.jpg",
    "edge-of-tomorrow": "https://image.tmdb.org/t/p/w500/xjw5IX4dBUMC44V7YbNNGviJbLu.jpg",
    "joker": "https://image.tmdb.org/t/p/w500/udDclJoHjfjb8Ekgsd4FDteOkCU.jpg",
    "parasite": "https://image.tmdb.org/t/p/w500/7IiTTgloJzvGI1TAYymCfbfl3vT.jpg",
    "gravity": "https://image.tmdb.org/t/p/w500/kZ2nZw8D681aphje8NJi5EfbMeV.jpg"
};

async function fix() {
    try {
        console.log('🔗 Connecting to MongoDB...');
        await mongoose.connect(DATABASE_URL);
        console.log('✅ Connected');

        for (const [slug, posterUrl] of Object.entries(posterFixes)) {
            const result = await Movie.updateOne({ slug }, { $set: { posterUrl } });
            const status = result.modifiedCount > 0 ? '✅' : '⚠️ not found';
            console.log(`${status} ${slug} → updated poster`);
        }

        await mongoose.disconnect();
        console.log('\n🎉 All poster URLs fixed!');
        process.exit(0);
    } catch (err) {
        console.error('❌ Error:', err.message);
        process.exit(1);
    }
}

fix();
