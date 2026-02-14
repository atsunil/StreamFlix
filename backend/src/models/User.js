const mongoose = require('mongoose');



const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  passwordHash: { type: String, required: true },
  role: { type: String, enum: ['user', 'admin'], default: 'user' },
  watchlist: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Movie' }],
  recentlyWatched: [{
    movie: { type: mongoose.Schema.Types.ObjectId, ref: 'Movie' },
    watchedAt: { type: Date, default: Date.now },
    position: { type: Number, default: 0 }
  }],
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('User', UserSchema);