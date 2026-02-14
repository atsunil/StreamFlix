const mongoose = require('mongoose');

const MovieSchema = new mongoose.Schema({
  title: { type: String, required: true, index: true },
  slug: { type: String, unique: true },
  description: String,
  genres: [String],
  releaseDate: Date,
  runtimeMinutes: Number,
  cast: [String],
  director: String,
  language: String,
  posterUrl: String,       // cloud/public URL
  trailerUrl: String,      // HLS / mp4 URL for trailer
  videoUrl: String,        // optional, for full movie
  rating: { type: Number, default: 0 },
  reviewsCount: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now },
  updatedAt: Date,
  isPublished: { type: Boolean, default: true },
});

module.exports = mongoose.model('Movie', MovieSchema);